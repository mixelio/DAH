from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dream.views import CommentListCreateView, DreamViewSet, LikeCommentView, LikeDreamView

app_name = 'dream'

router = DefaultRouter()
router.register(r'dreams', DreamViewSet)

urlpatterns = [
    path('dreams/<int:dream_id>/comments/', CommentListCreateView.as_view(), name='comment'),
    path('comments/<int:comment_id>/like/', LikeCommentView.as_view(), name='like-comment'),
    path('dreams/<int:dream_id>/like/', LikeDreamView.as_view(), name='like-dream'),
    path('', include(router.urls))
]
