from typing import Optional

import stripe
from django.conf import settings
from django.db import transaction
from django.db.models import QuerySet
from django.http import HttpResponseRedirect, HttpRequest
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework import viewsets, status
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from dream.models import Dream
from payment.models import Payment
from payment.serializers import PaymentSerializer


class PaymentViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Payment]:
        """Retrieve the appropriate queryset based on user permissions."""
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()
        if user.is_authenticated:
            return Payment.objects.filter(user_id=user.id)


stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentSuccessTempView(APIView):
    def get(self, request: HttpRequest) -> HttpResponseRedirect | Response:
        """Handle redirection after temporary payment success."""
        session_id: Optional[str] = request.GET.get('session_id')
        return_url: Optional[str] = request.GET.get('return_url', '/')

        if session_id:
            return redirect(
                reverse('payment:payment-success', kwargs={'session_id': session_id})
                + f"?return_url={return_url}"
            )

        return Response(
            {'error': 'Session ID not found.'}, status=status.HTTP_400_BAD_REQUEST
        )


class PaymentSuccessView(APIView):
    serializer_class = PaymentSerializer

    def get(self, request: Request, session_id: str) -> Response:
        """Handle payment success using Stripe session ID."""
        try:
            session = stripe.checkout.Session.retrieve(session_id)

            if session.payment_status != 'paid':
                return Response({'message': 'Payment not completed.'}, status=400)

            try:
                with transaction.atomic():
                    payment = Payment.objects.select_for_update().get(session_id=session_id)
                    if payment.status == Payment.StatusChoices.PAID:
                        return Response({'message': 'Payment already processed.'}, status=400)

                    payment.status = Payment.StatusChoices.PAID
                    payment.save()

                    dream = Dream.objects.get(id=payment.dream_id)
                    dream.update_accumulated(payment.money_to_pay)
                    dream.save(update_fields=['accumulated'])

                return_url = request.GET.get('return_url', '/')
                print(f"Redirecting to: {return_url}")
                return redirect(return_url)

            except Payment.DoesNotExist:
                return Response({'error': 'Payment not found.'}, status=404)

        except stripe.error.StripeError as e:
            return Response({'stripe_error': str(e)}, status=500)
        except Exception as e:
            return Response({'other_error': str(e)}, status=500)


class PaymentCancelView(APIView):
    serializer_class = PaymentSerializer

    def get(self, request) -> Response:
        """Handle payment cancellation."""
        return Response(
            {'message': 'Payment was cancelled. You can pay again within 24 hours.'}
        )
