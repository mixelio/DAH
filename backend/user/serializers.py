from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from django.utils.translation import gettext as _


class UserSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'email',
            'password',
            'is_staff',
            'first_name',
            'last_name',
            'photo',
            'photo_url',
            'location',
            'num_of_dreams',
            'about_me'
        )
        read_only_fields = ("is_staff",)
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def get_photo_url(self, obj: get_user_model()) -> str | None:
        """Create user photo url"""
        if obj.photo:
            return obj.photo.url
        return None

    def create(self, validated_data: dict) -> get_user_model():
        """Create a new users with encrypted password and return it"""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance: get_user_model(), validated_data: dict) -> get_user_model():
        """Update a users, set the password correctly and return it"""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()

        return user


class CreateUserSerializer(UserSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}


class AuthTokenSerializer(serializers.Serializer):
    email = serializers.CharField(label=_('Email'), write_only=True)
    password = serializers.CharField(
        label=_('Password'),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
    )
    token = serializers.CharField(label=_('Token'), read_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password,
            )

            # The authenticate call simply returns None for is_active=False
            # users. (Assuming the default ModelBackend authentication
            # backend.)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['users'] = user
        return attrs
