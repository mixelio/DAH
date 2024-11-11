from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Comment, Dream
from .serializers import CommentSerializer, DreamSerializer


class CommentListCreateView(APIView):
    def get(self, request, dream_id):
        # Отримуємо всі коментарі до конкретної мрії
        comments = Comment.objects.filter(dream__id=dream_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, dream_id):
        # Створення нового коментаря
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(dream_id=dream_id, user=request.user)  # автоматичне присвоєння dream і user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikeCommentView(APIView):
    def post(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            comment.likes += 1
            comment.save()
            return Response({'likes': comment.likes}, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)


class DreamViewSet(viewsets.ModelViewSet):
    queryset = Dream.objects.all()
    serializer_class = DreamSerializer

    # Окремі методи для обробки додаткової логіки (якщо потрібно)

    def perform_create(self, serializer):
        # Автоматично прив'язуємо користувача до мрії під час створення
        serializer.save(user=self.request.user)
