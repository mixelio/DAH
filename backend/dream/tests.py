from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from dream.models import Dream


def sample_user(**params):
    defaults = {
        'email': 'test_email',
        'password': 'test_password1',
    }
    defaults.update(params)
    return get_user_model().objects.create_user(**defaults)


def sample_dream(**params):
    defaults = {
        'name': 'test name',
        'description': 'test description',
        'user': sample_user(),
        'category': 'SERVICES',
        'location': 'test location',
    }
    defaults.update(params)
    return Dream.objects.create(**defaults)


class CommentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            "test@test.com",
            "testpass",
        )
        self.client.force_authenticate(self.user)
        self.dream = sample_dream(user=self.user)

    def test_get_comments(self):
        url = f'/api/dream/{self.dream.id}/comments/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_post_comment(self):
        url = f'/api/dream/{self.dream.id}/comments/'
        payload = {'text': 'This is a test comment'}
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['text'], 'This is a test comment')
        self.assertEqual(response.data['user'], self.user.id)


class DreamTests(TestCase):
    def setUp(self):