from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from dream.models import Comment, Dream
from dream.serializers import CommentSerializer, DreamSerializer, DreamReadSerializer


class CommentListCreateView(APIView):
    def get(self, request, dream_id):
        comments = Comment.objects.filter(dream__id=dream_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, dream_id):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(dream_id=dream_id, user=request.user)
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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'post':
            return DreamSerializer
        return DreamReadSerializer
