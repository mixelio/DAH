import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from user.serializers import (
    UserSerializer,
    AuthTokenSerializer,
    CreateUserSerializer,
)


class CreateUserView(generics.CreateAPIView):
    serializer_class = CreateUserSerializer


class CreateTokenView(ObtainAuthToken):
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    serializer_class = AuthTokenSerializer


class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self) -> get_user_model():
        return self.request.user


class ListUserView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class RetrieveDetailUserView(generics.RetrieveAPIView, ListUserView):
    lookup_field = 'id'
    permission_classes = (AllowAny,)


class PasswordResetRequestView(APIView):
    """
    View to handle password reset email requests.
    """

    def post(self, request: Request) -> Response:
        email = request.data.get('email')
        return_url = request.data.get('return_url')

        if not email or not return_url:
            return Response(
                {'error': 'Email and return_url are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            return Response(
                {'error': 'User with this email does not exist'},
                status=status.HTTP_404_NOT_FOUND,
            )

        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f'{return_url}?uidb64={uidb64}&token={token}&email={email}'

        send_mail(
            subject='Password Reset Request',
            message=f'Click the link below to '
                    f'reset your password:\n{reset_url}',
            from_email='noreply@yourdomain.com',
            recipient_list=[email],
        )

        return Response(
            {'message': 'Password reset email sent'}, status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """
    View to handle password reset confirmation.
    """

    def post(self, request: Request) -> Response:
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        new_password = request.data.get('password')

        if not uidb64 or not token or not new_password:
            return Response(
                {'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_user_model().objects.get(pk=uid)
        except (
            TypeError,
            ValueError,
            OverflowError,
            get_user_model().DoesNotExist,
        ):
            return Response(
                {'error': 'Invalid token or user'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response(
                {'error': 'Invalid or expired token'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 5:
            return Response(
                {'error': 'Password must be at least 5 characters long'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {'message': 'Password reset successful'}, status=status.HTTP_200_OK
        )


class GoogleLoginAPIView(APIView):
    """
    API endpoint for user authentication via Google OAuth.

    This view accepts a Google OAuth token, verifies it with Google,
    retrieves user information, and either logs in or registers the user.
    If successful, it returns JWT authentication tokens.
    """

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({
                'error': 'Access token is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        google_user_info_url = (f'https://oauth2.googleapis'
                                f'.com/tokeninfo?id_token={token}')
        response = requests.get(google_user_info_url)

        if response.status_code != 200:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)

        user_data = response.json()
        email = user_data.get('email')
        first_name = user_data.get('given_name', '')
        last_name = user_data.get('family_name', '')

        if not email:
            return Response({
                'error': 'Email not found in token'
            }, status=status.HTTP_400_BAD_REQUEST)

        user, created = get_user_model().objects.get_or_create(
            email=email,
            defaults={'first_name': first_name, 'last_name': last_name}
        )

        if not user.is_active:
            return Response({
                'error': 'User account is inactive'
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
