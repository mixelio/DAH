from decimal import Decimal

import stripe
from django.conf import settings
from django.urls import reverse
from rest_framework.request import Request

from dream.models import Dream
from payment.models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_stripe_session(
    dream_id: int, total_amount: Decimal, request: Request
) -> Payment:
    dream = Dream.objects.get(id=dream_id)

    product_name = f'Payment for dream {dream.name}'

    return_url = request.data.get('return_url', '/')

    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[
            {
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': product_name,
                    },
                    'unit_amount': int(total_amount * 100),
                },
                'quantity': 1,
            }
        ],
        mode='payment',
        success_url=request.build_absolute_uri(
            reverse('payment:checkout-success')
        )
        + f'?session_id={{CHECKOUT_SESSION_ID}}&return_url={return_url}',
        cancel_url=request.build_absolute_uri(
            reverse('payment:payment-cancel')
        ),
    )

    payment = Payment.objects.create(
        user_id=request.user.id if request.user.is_authenticated else 0,
        status=Payment.StatusChoices.PENDING,
        session_id=checkout_session.id,
        session_url=checkout_session.url,
        dream_id=dream_id,
        money_to_pay=total_amount,
    )

    return payment
