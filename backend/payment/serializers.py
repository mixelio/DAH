from rest_framework import serializers
from payment.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            'user_id',
            "status",
            'dream_id',
            "session_url",
            "session_id",
            "money_to_pay",
        ]
