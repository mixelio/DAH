from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dream.views import (
    CommentListCreateView,
    DreamViewSet,
    LikeCommentView,
    FulfillDreamView
)

app_name = 'dream'

router = DefaultRouter()
router.register(r'dream', DreamViewSet, basename='dream')

urlpatterns = [
    path('dream/<int:dream_id>/comments/', CommentListCreateView.as_view(), name='comment'),
    path('comment/<int:comment_id>/like/', LikeCommentView.as_view(), name='like-comment'),
    path('dream/<int:dream_id>/fulfill/', FulfillDreamView.as_view(), name='fulfill-dream'),
    path('', include(router.urls))
]
