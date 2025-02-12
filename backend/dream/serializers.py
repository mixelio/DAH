from django.contrib.auth import get_user_model
from rest_framework import serializers
from dream.models import Dream, Comment, Contribution, UserFavorites
from user.models import User


class UserDreamRetrieveSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'photo_url']

    def get_photo_url(self, obj: get_user_model()) -> str | None:
        """Create user photo url"""
        if obj.photo:
            return obj.photo.url
        return None


class UserDreamListSerializer(UserDreamRetrieveSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = ['dream', 'user', 'description', 'date']


class DreamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dream
        fields = ['id', 'name', 'description', 'image', 'cost', 'category', 'location']
        read_only_fields = ['id']

    category = serializers.ChoiceField(choices=Dream.Category.choices)


class DreamListSerializer(DreamCreateSerializer):
    contributions = ContributionSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    user = UserDreamListSerializer(read_only=True)

    class Meta:
        model = Dream
        fields = [
            'id',
            'name',
            'description',
            'image',
            'image_url',
            'user',
            'cost',
            'accumulated',
            'status',
            'category',
            'date_added',
            'location',
            'views',
            'contributions',
        ]

    def get_image_url(self, obj: Dream) -> str | None:
        if obj.image:
            return obj.image.url
        return None


class DreamRetrieveSerializer(DreamListSerializer):
    user = UserDreamRetrieveSerializer(read_only=True)


class CommentSerializer(serializers.ModelSerializer):
    user = UserDreamRetrieveSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'dream', 'text', 'created_at',]
        read_only_fields = ['id', 'dream', 'user', 'created_at',]


class UserFavoritesSerializer(serializers.ModelSerializer):
    dreams = DreamRetrieveSerializer(many=True)

    class Meta:
        model = UserFavorites
        fields = ['id', 'user', 'dreams']


class MoneyDreamRequestSerializer(serializers.Serializer):
    contribution_amount = serializers.IntegerField(
        min_value=1, help_text='Amount of money to contribute.'
    )


class NonMoneyDreamRequestSerializer(serializers.Serializer):
    contribution_description = serializers.CharField(
        help_text='Description of the contribution.'
    )
