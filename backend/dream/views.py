from abc import ABC, abstractmethod
from decimal import Decimal

from django.db.models import F
from django.shortcuts import get_object_or_404
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response

from dream.models import Comment, Dream, Contribution
from payment.serializers import PaymentSerializer

from utils.stripe_helpers import create_stripe_session

from dream.serializers import (
    CommentSerializer,
    DreamSerializer,
    DreamReadSerializer,
    CommentReadSerializer, ContributionSerializer
)
from user.permissions import IsOwnerAdminOrReadOnly


class CommentListCreateView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentSerializer
        return CommentReadSerializer

    def get(self, request, dream_id):
        comments = Comment.objects.filter(dream__id=dream_id).select_related('dream')
        serializer = CommentReadSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, dream_id):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(dream_id=dream_id, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikeCommentView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            comment.likes += 1
            comment.save()
            return Response({'likes': comment.likes}, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)


class DreamViewSet(viewsets.ModelViewSet):
    queryset = Dream.objects.all().select_related('user')
    serializer_class = DreamSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerAdminOrReadOnly)

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        if category:
            return self.queryset.filter(category=category)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return DreamSerializer
        return DreamReadSerializer

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

        contribution_amount = request.data.get('contribution_amount', 0)
        if contribution_amount <= 0:
            raise ValueError('Contribution must be a positive integer.')

        remaining_balance = dream.cost - (dream.accumulated or 0)

        if contribution_amount > remaining_balance:
            raise ValueError(f'Contribution exceeds the remaining balance: {remaining_balance}.')
        try:
            payment = create_stripe_session(dream.id, Decimal(contribution_amount), request)
        except Exception as e:
            print(f'stripe_exception: {e}')
        dream.accumulated += contribution_amount
        dream.save(update_fields=['accumulated'])

        return payment


class NonMoneyDreamHandler(DreamHandler):
    def handle(self, dream, user, request):
        contribution_description = request.data.get('contribution_description', '')
        if not contribution_description:
            raise ValueError('Description of contribution is required for this category.')
        contribution = Contribution.objects.create(dream=dream, user=user, description=contribution_description)
        dream.status = Dream.Status.COMPLETED
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
        if response:
            serializer = PaymentSerializer(response)
            return Response(serializer.data, status=status.HTTP_200_OK)
        serializer = ContributionSerializer(response)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
