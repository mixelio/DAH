from django.urls import path, include
from rest_framework.routers import DefaultRouter

from payment.views import (
    PaymentViewSet,
    PaymentSuccessView,
    PaymentCancelView,
    PaymentSuccessTempView,
)

router = DefaultRouter()
router.register('payment', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path(
        'payment/success/<str:session_id>/',
        PaymentSuccessView.as_view(),
        name='payment-success',
    ),
    path(
        'payment/cancel/', PaymentCancelView.as_view(), name='payment-cancel'
    ),
    path(
        'checkout/', PaymentSuccessTempView.as_view(), name='checkout-success'
    ),
]

app_name = 'payment'
