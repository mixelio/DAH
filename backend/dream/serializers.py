from rest_framework import serializers
from dream.models import Dream, Comment, Contribution


class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = ['dream', 'user', 'description', 'date']


class DreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dream
        fields = ['name', 'description', 'image', 'cost', 'category', 'location']

    category = serializers.ChoiceField(choices=Dream.Category.choices)


class DreamReadSerializer(DreamSerializer):
    class Meta:
        model = Dream
        fields = [
            'id',
            'name',
            'description',
            'image',
            'user',
            'cost',
            'accumulated',
            'status',
            'category',
            'date_added',
            'location',
            'likes'
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text']


class CommentReadSerializer(CommentSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at', 'likes']
