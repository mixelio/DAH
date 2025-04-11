import tempfile

from PIL import Image
from cloudinary.uploader import destroy
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from dream.models import Dream, Contribution


def sample_user(**params):
    defaults = {
        'email': 'test_email@test.com',
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
        self.user = sample_user(email='mail@com')
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
        self.assertEqual(response.data['user']['id'], self.user.id)


class DreamTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = sample_user(email='mail@com')
        self.client.force_authenticate(self.user)
        self.dream = sample_dream(user=self.user)

    def test_connection(self):
        list_response = self.client.get('/api/dream/')
        retrieve_response = self.client.get(f'/api/dream/{self.dream.id}/')
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(retrieve_response.status_code, 200)

    def test_post_dream(self):
        url = '/api/dream/'
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            res = self.client.post(
                url,
                {
                    'name': 'This',
                    'description': 'This is a test description',
                    'image': ntf,
                    'category': Dream.CategoryChoices.SERVICES,
                    'location': 'test location',
                },
                format='multipart',
            )

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        dream = Dream.objects.get(name='This')
        self.assertTrue(dream.image)
        self.assertEqual(dream.description, 'This is a test description')
        self.assertEqual(dream.category, Dream.CategoryChoices.SERVICES)
        self.assertEqual(dream.location, 'test location')
        self.assertEqual(dream.user.id, self.user.id)

        image_url = dream.image.url
        base_url = 'http://res.cloudinary.com/dsylcnoz9/'
        relative_url = image_url.replace(base_url, '')
        self.assertEqual(res.data['image'], relative_url)

        if dream.image:
            public_id = dream.image.public_id
            if public_id:
                destroy(public_id)


class FulfillDreamViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = sample_user(email='testuser', num_of_dreams=0)
        self.client.force_authenticate(user=self.user)

    def test_fulfill_money_dream_success(self):
        dream = Dream.objects.create(
            category=Dream.CategoryChoices.MONEY,
            cost=100,
            accumulated=50,
            user=self.user,
        )
        url = reverse('dream:fulfill-dream', args=[dream.id])
        data = {'contribution_amount': 30}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['dream_id'], dream.id)
        self.assertEqual(response.data['money_to_pay'], '30.00')
        self.assertEqual(response.data['status'], 'PENDING')
        self.assertEqual(response.data['user_id'], self.user.id)

        self.user.refresh_from_db()
        self.assertEqual(self.user.num_of_dreams, 1)

    def test_fulfill_money_dream_exceeds_balance(self):
        dream = Dream.objects.create(
            category=Dream.CategoryChoices.MONEY,
            cost=100,
            accumulated=90,
            user=self.user,
        )
        url = reverse('dream:fulfill-dream', args=[dream.id])
        data = {'contribution_amount': 20}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            'Contribution exceeds the remaining balance',
            response.data['error'],
        )

    def test_fulfill_services_dream_success(self):
        dream = Dream.objects.create(
            category=Dream.CategoryChoices.SERVICES, user=self.user
        )
        url = reverse('dream:fulfill-dream', args=[dream.id])
        data = {'contribution_description': 'Fix plumbing'}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        dream.refresh_from_db()
        self.assertEqual(dream.status, Dream.StatusChoices.PENDING)
        self.assertEqual(
            Contribution.objects.filter(dream=dream, user=self.user).count(), 1
        )
        self.assertEqual(response.data['description'], 'Fix plumbing')
        self.assertEqual(
            response.data['user'],
            {
                'id': self.user.id,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'photo_url': None,
                'email': self.user.email,
            },
        )

    def test_fulfill_dream_already_completed(self):
        dream = Dream.objects.create(
            category=Dream.CategoryChoices.MONEY,
            status=Dream.StatusChoices.COMPLETED,
            user=self.user,
        )
        url = reverse('dream:fulfill-dream', args=[dream.id])
        data = {'contribution_amount': 20}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            'This dream has already been fulfilled', response.data['error']
        )

    def test_fulfill_unsupported_category(self):
        dream = Dream.objects.create(
            category='UNSUPPORTED_CATEGORY', user=self.user
        )
        url = reverse('dream:fulfill-dream', args=[dream.id])
        response = self.client.post(url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Unsupported dream category', response.data['error'])

    def test_unauthorized_access(self):
        dream = Dream.objects.create(
            category=Dream.CategoryChoices.MONEY, user=self.user, cost=5
        )
        self.client.force_authenticate(user=None)
        url = reverse('dream:fulfill-dream', args=[dream.id])
        response = self.client.post(url, {
            'contribution_amount': 1
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AcceptAndRejectDreamContributionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = sample_user(email='testuser@mail.com')
        self.client.force_authenticate(user=self.user)

        self.dream = Dream.objects.create(
            name='test dream',
            description='test description',
            category=Dream.CategoryChoices.GIFTS,
            user=self.user,
        )
        self.contribution = Contribution.objects.create(
            user=sample_user(email='sam@mail.com'),
            dream=self.dream,
            description='test description',
        )

    def test_accept_contribution_succes(self):
        url = reverse('dream:dream-accept-contribution', kwargs={'pk': self.dream.id})
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], f'Dream {self.dream.id} marked as completed.')

    def test_accept_contribution_with_unsupported_category(self):
        dream = Dream.objects.create(
            name='test dream',
            description='test description',
            category=Dream.CategoryChoices.MONEY,
            user=self.user,
        )

        url = reverse('dream:dream-accept-contribution', kwargs={'pk': dream.id})
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Dream with category "MONEY" unsupported.')

    def test_accept_contribution_with_completed_status(self):
        dream = Dream.objects.create(
            name='test dream',
            description='test description',
            category=Dream.CategoryChoices.GIFTS,
            status=Dream.StatusChoices.COMPLETED,
            user=self.user,
        )

        url = reverse('dream:dream-accept-contribution', kwargs={'pk': dream.id})
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], f'Dream {dream.id} is already completed.')

    def test_reject_contribution_succes(self):
        url = reverse('dream:dream-reject-contribution', kwargs={'pk': self.dream.id})
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['detail'],
            f'Dream {self.dream.id} marked as rejected and contribution removed.'
        )

    def test_reject_contribution_with_unsupported_category(self):
        dream = Dream.objects.create(
            name='test dream',
            description='test description',
            category=Dream.CategoryChoices.MONEY,
            user=self.user,
        )

        url = reverse('dream:dream-reject-contribution', kwargs={'pk': dream.id})
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Dream with category "MONEY" unsupported.')
