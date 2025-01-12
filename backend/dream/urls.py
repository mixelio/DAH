from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dream.views import (
    CommentListCreateView,
    DreamViewSet,
    FulfillDreamView, CommentDetailView
)

app_name = 'dream'

router = DefaultRouter()
router.register(r'dream', DreamViewSet, basename='dream')

urlpatterns = [
    path('dream/<int:dream_id>/comments/', CommentListCreateView.as_view(), name='comment'),
    path(
        'dream/<int:dream_id>/comments/<int:pk>/',
        CommentDetailView.as_view(),
        name='comment-update'
    ),
    path('dream/<int:dream_id>/fulfill/', FulfillDreamView.as_view(), name='fulfill-dream'),
    path('', include(router.urls))
]
