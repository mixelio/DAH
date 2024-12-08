from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.views import APIView

from user.serializers import UserSerializer, AuthTokenSerializer, CreateUserSerializer


class CreateUserView(generics.CreateAPIView):
    serializer_class = CreateUserSerializer


class CreateTokenView(ObtainAuthToken):
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    serializer_class = AuthTokenSerializer


class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


class ListUserView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class RetrieveDetailUserView(generics.RetrieveAPIView, ListUserView):
    lookup_field = 'id'



class PasswordResetRequestView(APIView):
    """
    View to handle password reset email requests.
    """

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

        # Generate a password reset token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)

        # Build the password reset URL
        reset_url = request.build_absolute_uri(
            reverse(
                'user:password_reset_confirm', kwargs={
                    'uidb64': urlsafe_base64_encode(force_bytes(user.pk)), 'token': token
                }
            )
        )

        # Send the email
        send_mail(
            subject='Password Reset Request',
            message=f'Click the link below to reset your password:\n{reset_url}',
            from_email='noreply@yourdomain.com',
            recipient_list=[email],
        )

        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """
    View to handle password reset confirmation.
    """

    def post(self, request, uidb64, token):
        try:
            # Decode the user ID
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            return Response({'error': 'Invalid token or user'}, status=status.HTTP_400_BAD_REQUEST)

        # Check token validity
        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and update the new password
        new_password = request.data.get('password')
        if not new_password or len(new_password) < 5:
            raise ValidationError('Password must be at least 8 characters long')

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
