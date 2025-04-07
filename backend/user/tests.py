from django.test import TestCase
from django.contrib.auth import get_user_model
from dream.models import UserFavorites

User = get_user_model()


class UserSignalTest(TestCase):
    def test_favorites_created_on_user_creation(self):
        user = User.objects.create(email="test@example.com", password="password123")

        self.assertTrue(UserFavorites.objects.filter(user=user).exists())
