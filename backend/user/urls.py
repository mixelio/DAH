from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from user.views import (
    CreateUserView,
    ManageUserView,
    RetrieveDetailUserView,
    ListUserView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

app_name = 'user'

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='create'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', ManageUserView.as_view(), name='manage'),
    path('<int:id>/', RetrieveDetailUserView.as_view(), name='retrieve_user'),
    path('', ListUserView.as_view(), name='users'),
    path('me/', ManageUserView.as_view(), name='manage'),
    path(
        'password-reset/',
        PasswordResetRequestView.as_view(),
        name='password_reset',
    ),
    path(
        'password-reset-confirm/',
        PasswordResetConfirmView.as_view(),
        name='password_reset_confirm',
    ),
]
