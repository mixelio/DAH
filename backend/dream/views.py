from django.shortcuts import get_object_or_404
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from dream.models import Comment, Dream, Contribution
from dream.serializers import (
    CommentSerializer,
    DreamSerializer,
    DreamReadSerializer,
    CommentReadSerializer
)


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
    permission_classes = (IsAuthenticatedOrReadOnly,)

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


class LikeDreamView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, dream_id):
        try:
            dream = Dream.objects.get(id=dream_id)
            dream.likes += 1
            dream.save()
            return Response({'likes': dream.likes}, status=status.HTTP_200_OK)
        except Dream.DoesNotExist:
            return Response({'error': 'Dream not found'}, status=status.HTTP_404_NOT_FOUND)


class FulfillDreamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, dream_id):
        dream = get_object_or_404(Dream, id=dream_id)

        if dream.category == Dream.Category.MONEY:
            contribution_amount = request.data.get('contribution_amount', 0)
            if contribution_amount <= 0:
                return Response(
                    {'error': 'Contribution must be a positive integer.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            dream.accumulated += contribution_amount
            if dream.accumulated >= dream.cost:
                dream.status = Dream.Status.COMPLETED
            else:
                dream.status = Dream.Status.PENDING

        elif dream.category in {Dream.Category.SERVICES, Dream.Category.GIFTS}:
            contribution_description = request.data.get('contribution_description', '')
            if not contribution_description:
                return Response(
                    {'error': 'Description of contribution is required for this category.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            Contribution.objects.create(
                dream=dream,
                user=request.user,
                description=contribution_description
            )
            dream.status = Dream.Status.COMPLETED

        dream.save()
        serializer = DreamReadSerializer(dream)
        return Response(serializer.data, status=status.HTTP_200_OK)
