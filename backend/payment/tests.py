import stripe
from django.test import TestCase
from django.urls import reverse
from unittest.mock import MagicMock
from rest_framework.test import APIClient
from stripe.error import StripeError
from payment.models import Payment
from dream.models import Dream
from user.models import User


class PaymentSuccessViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com', password='password123')
        self.dream = Dream.objects.create(
            name='Test Dream',
            description='Test description',
            cost=1000,
            accumulated=100,
            user=self.user,
            category=Dream.Category.MONEY,
            location='Test Location'
        )

    def test_payment_success(self):
        payment = Payment.objects.create(
            session_id='test_session_id',
            status=Payment.StatusChoices.PENDING,
            money_to_pay=100,
            dream_id=self.dream.id,
        )
        stripe.checkout.Session.retrieve = MagicMock(
            return_value=MagicMock(payment_status='paid')
        )

        url = reverse('payment:payment-success', args=['test_session_id'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 302)

        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.StatusChoices.PAID)

        self.dream.refresh_from_db()
        self.assertEqual(self.dream.accumulated, 200)

    def test_payment_already_processed(self):
        Payment.objects.create(
            session_id='test_session_id',
            status=Payment.StatusChoices.PAID,
            money_to_pay=100,
            dream_id=self.dream.id,
        )
        stripe.checkout.Session.retrieve = MagicMock(
            return_value=MagicMock(payment_status='paid')
        )

        url = reverse('payment:payment-success', args=["test_session_id"])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Payment already processed.')

    def test_payment_not_completed(self):
        stripe.checkout.Session.retrieve = MagicMock(
            return_value=MagicMock(payment_status='unpaid')
        )

        url = reverse('payment:payment-success', args=['test_session_id'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Payment not completed.')

    def test_payment_not_found(self):
        stripe.checkout.Session.retrieve = MagicMock(
            return_value=MagicMock(payment_status='paid')
        )

        url = reverse('payment:payment-success', args=['non_existing_session_id'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Payment not found.')

    def test_stripe_error(self):
        stripe.checkout.Session.retrieve = MagicMock(side_effect=StripeError('Stripe API error'))

        url = reverse('payment:payment-success', args=['test_session_id'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 500)
        self.assertIn('stripe_error', response.data)

    def test_other_error(self):
        stripe.checkout.Session.retrieve = MagicMock(side_effect=Exception('Some other error'))

        url = reverse('payment:payment-success', args=['test_session_id'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 500)
        self.assertIn('other_error', response.data)
