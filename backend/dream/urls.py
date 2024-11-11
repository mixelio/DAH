from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dream.views import CommentListCreateView, DreamViewSet

app_name = 'dream'

router = DefaultRouter()
router.register(r'dreams', DreamViewSet)

urlpatterns = [
    path('dreams/<int:dream_id>/comments/', CommentListCreateView.as_view(), name='comment'),
    path('', include(router.urls))
]
