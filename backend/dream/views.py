import logging
from abc import ABC, abstractmethod
from decimal import Decimal

from django.db.models import F
from django.shortcuts import get_object_or_404
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
    extend_schema_view
)
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from dream.models import Comment, Dream, Contribution
from payment.models import Payment
from payment.serializers import PaymentSerializer

from utils.stripe_helpers import create_stripe_session

from dream.serializers import (
    DreamCreateSerializer,
    DreamListSerializer,
    CommentSerializer,
    ContributionSerializer, DreamRetrieveSerializer
)
from user.permissions import IsOwnerAdminOrReadOnly


logger = logging.getLogger(__name__)


class CommentListCreateView(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(
            dream_id=self.kwargs['dream_id']
        ).select_related('dream', 'user')

    def perform_create(self, serializer):
        serializer.save(dream_id=self.kwargs['dream_id'], user=self.request.user)


class CommentDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(
            dream_id=self.kwargs['dream_id']
        ).select_related('dream', 'user')

    def perform_update(self, serializer):
        comment = self.get_object()
        if comment.user != self.request.user:
            raise PermissionDenied('You do not have permission to edit this comment.')
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != self.request.user:
            raise PermissionDenied('You do not have permission to delete this comment.')

        serializer = self.get_serializer(instance)
        response_data = serializer.data

        self.perform_destroy(instance)

        return Response(
            response_data,
            status=status.HTTP_200_OK
        )


class DreamViewSet(viewsets.ModelViewSet):
    serializer_class = DreamCreateSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerAdminOrReadOnly)

    def get_queryset(self):
        queryset = Dream.objects.all().select_related('user').prefetch_related('contributions')
        category = self.request.query_params.get('category', None)
        if category:
            return queryset.filter(category__icontains=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        logger.error(f"Received data: {request.data}")
        print("Received data:", request.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_serializer_class(self):
        if self.action == 'list':
            return DreamListSerializer
        if self.action == 'retrieve':
            return DreamRetrieveSerializer
        return DreamCreateSerializer

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a dream and increment its views count."""
        instance = self.get_object()
        # Increment views count
        instance.views = (instance.views or 0) + 1
        instance.save(update_fields=['views'])

        # Serialize and return the response
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='category',
                description='Filter by categories. Available '
                            'values: Money donation, Volunteer services, Gifts.',
                required=False,
                type=OpenApiTypes.STR,
                examples=[
                    OpenApiExample(
                        'Money donation',
                        value='Money donation',
                    ),
                    OpenApiExample(
                        'Volunteer services',
                        value='Volunteer services',
                    ),
                    OpenApiExample(
                        'Gifts',
                        value='Gifts',
                    )
                ]
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """Get list of dreams"""
        return super().list(request, *args, **kwargs)


class DreamHandler(ABC):
    @abstractmethod
    def handle(self, dream, user, request):
        raise NotImplementedError('This method should be implemented by subclasses.')


class MoneyDreamHandler(DreamHandler):
    def handle(self, dream, user, request):
        if not request:
            raise ValueError('Request object is required for this operation.')

        contribution_amount = int(request.data.get('contribution_amount', 0))
        if contribution_amount <= 0:
            raise ValueError('Contribution must be a positive integer.')

        remaining_balance = dream.cost - (dream.accumulated or 0)

        if contribution_amount > remaining_balance:
            raise ValueError(f'Contribution exceeds the remaining balance: {remaining_balance}.')
        try:
            payment = create_stripe_session(dream.id, Decimal(contribution_amount), request)
            return payment
        except Exception as e:
            print(f'stripe_exception: {e}')


class NonMoneyDreamHandler(DreamHandler):
    def handle(self, dream, user, request):
        contribution_description = request.data.get('contribution_description', '')
        if not contribution_description:
            raise ValueError('Description of contribution is required for this category.')
        contribution = Contribution.objects.create(dream=dream, user=user, description=contribution_description)
        dream.status = Dream.Status.COMPLETED
        dream.save(update_fields=['status'])
        return contribution


class FulfillDreamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, dream_id):
        dream = get_object_or_404(Dream, id=dream_id)
        user = request.user

        if dream.status == Dream.Status.COMPLETED:
            return Response(
                {'error': 'This dream has already been fulfilled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        handlers = {
            Dream.Category.MONEY: MoneyDreamHandler(),
            Dream.Category.SERVICES: NonMoneyDreamHandler(),
            Dream.Category.GIFTS: NonMoneyDreamHandler(),
        }

        handler = handlers.get(dream.category)
        if not handler:
            return Response(
                {'error': 'Unsupported dream category.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            response = handler.handle(dream, user, request)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        dream.save()
        user.num_of_dreams = F('num_of_dreams') + 1
        user.save()
        user.refresh_from_db()
        if isinstance(response, Payment):
            serializer = PaymentSerializer(response)
        elif isinstance(response, Contribution):
            serializer = ContributionSerializer(response)
        else:
            return Response(
                {'error': 'Unexpected response type from handler.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema_view(
    list=extend_schema(
        summary='Get the list of favorite dreams of authenticated user',
        description='Retrieve all dreams that the '
                    'authenticated user has marked as favorites.',
        responses={
            200: DreamRetrieveSerializer(many=True),
        },
    ),
    create=extend_schema(
        summary='Add a dream to favorites',
        description='Mark a dream as a favorite by '
                    'providing its ID in the request body.',
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'dream_id': {
                        'type': 'integer',
                        'description': 'ID of the dream to add to favorites',
                        'example': 1
                    }
                },
                'required': ['dream_id']
            }
        },
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string',
                        'example': 'Dream 1 added to favorites'
                    }
                }
            },
            404: {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string',
                        'example': 'Dream 1 not found'
                    }
                }
            },
        },
    ),
    destroy=extend_schema(
        summary='Remove a dream from favorites',
        description='Remove a dream from the users '
                    'favorites list by providing its '
                    'ID in the path parameter.',
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string',
                        'example': 'Dream 1 removed from favorites'
                    }
                }
            },
            404: {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string',
                        'example': 'Dream 1 not found'
                    }
                }
            },
        },
    )
)
class FavoritesViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        favorites = request.user.favorites.dreams.prefetch_related(
            'favorited_by').select_related('user').all()
        serializer = DreamRetrieveSerializer(favorites, many=True)
        return Response(serializer.data)

    def create(self, request):
        dream_id = request.data.get('dream_id')
        try:
            dream = Dream.objects.get(id=dream_id)
            request.user.favorites.dreams.add(dream)
            return Response(
                {'message': f'Dream {dream_id} added to favorites'}, status=status.HTTP_200_OK
            )
        except Dream.DoesNotExist:
            return Response(
                {'error': f'Dream {dream_id} not found'}, status=status.HTTP_404_NOT_FOUND
            )

    def destroy(self, request, pk=None):
        try:
            dream = Dream.objects.get(id=pk)
            request.user.favorites.dreams.remove(dream)
            return Response(
                {'message': f'Dream {pk} removed from favorites'}, status=status.HTTP_200_OK
            )
        except Dream.DoesNotExist:
            return Response(
                {'error': f'Dream {pk} not found'}, status=status.HTTP_404_NOT_FOUND
            )
