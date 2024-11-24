from decimal import Decimal

import stripe
from django.conf import settings
from django.urls import reverse

from payment.models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_stripe_session(
    dream_id: str, total_amount: Decimal, request
) -> Payment:

    product_name = f'Payment for dream id {dream_id}'

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
        success_url=request.build_absolute_uri(reverse('payment:checkout-success'))
        + f'?session_id={{CHECKOUT_SESSION_ID}}',
        cancel_url=request.build_absolute_uri(reverse('payment:payment-cancel')),
    )

    payment = Payment.objects.create(
        user_id=request.user.id,
        status=Payment.StatusChoices.PENDING,
        session_id=checkout_session.id,
        session_url=checkout_session.url,
        dream_id=dream_id,
        money_to_pay=total_amount,
    )

    return payment
