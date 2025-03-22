from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dream.views import (
    CommentListCreateView,
    DreamViewSet,
    FulfillDreamView,
    CommentDetailView,
    FavoritesViewSet,
)

app_name = 'dream'

router = DefaultRouter()
router.register(r'dream', DreamViewSet, basename='dream')

urlpatterns = [
    path(
        'dream/<int:dream_id>/comments/',
        CommentListCreateView.as_view(),
        name='comment',
    ),
    path(
        'dream/<int:dream_id>/comments/<int:pk>/',
        CommentDetailView.as_view(),
        name='comment-update',
    ),
    path(
        'dream/<int:dream_id>/fulfill/',
        FulfillDreamView.as_view(),
        name='fulfill-dream',
    ),
    path(
        'favorites/',
        FavoritesViewSet.as_view({'get': 'list', 'post': 'create'}),
    ),
    path(
        'favorites/<int:pk>/', FavoritesViewSet.as_view({'delete': 'destroy'})
    ),
    path('', include(router.urls)),
]
