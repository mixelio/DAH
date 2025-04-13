from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Optional, Union

import stripe
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.request import Request
from rest_framework.response import Response

from dream.models import Dream, Contribution
from payment.models import Payment
from utils.stripe_helpers import create_stripe_session


class DreamHandler(ABC):
    """
    Abstract base class for handling different types of dream fulfillment.
    """

    @abstractmethod
    def handle(
        self, dream: Dream, user: get_user_model(), request: Request
    ) -> Optional[Union[Contribution, Payment]]:
        """
        Processes the fulfillment of a given dream.

        :param dream: The dream instance to be fulfilled.
        :param user: The user making the contribution.
        :param request: The HTTP request containing necessary data.
        :raises NotImplementedError:
        If the method is not implemented in a subclass.
        """
        raise NotImplementedError(
            'This method should be implemented by subclasses.'
        )


class MoneyDreamHandler(DreamHandler):
    def handle(
        self, dream: Dream, user: get_user_model(), request: Request
    ) -> Optional[Payment] | Response:
        if not request:
            raise ValueError('Request object is required for this operation.')

        contribution_amount = int(request.data.get('contribution_amount', 0))
        if contribution_amount <= 0:
            raise ValueError('Contribution must be a positive integer.')

        remaining_balance = dream.cost - (dream.accumulated or 0)

        if contribution_amount > remaining_balance:
            raise ValueError(
                f'Contribution exceeds the '
                f'remaining balance: {remaining_balance}.'
            )
        try:
            payment = create_stripe_session(
                dream.id, Decimal(contribution_amount), request
            )
            return payment
        except ValidationError as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.StripeError as e:
            return Response(
                {"error": f"Payment error. Please try again. {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception as e:
            return Response(
                {"error": f"Unexpected server error. {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class NonMoneyDreamHandler(DreamHandler):
    def handle(
        self, dream: Dream, user: get_user_model(), request: Request
    ) -> Contribution:
        contribution_description = request.data.get(
            'contribution_description', ''
        )

        if not contribution_description:
            raise ValueError(
                'Description of contribution ' 'is required for this category.'
            )

        if hasattr(dream, 'contributions') and dream.contributions:
            raise ValidationError('This dream already has an associated contribution.')

        contribution = Contribution.objects.create(
            dream=dream, user=user, description=contribution_description
        )
        dream.status = Dream.StatusChoices.PENDING
        dream.save(update_fields=['status'])
        return contribution
