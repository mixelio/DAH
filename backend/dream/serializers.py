from rest_framework import serializers
from dream.models import Dream, Comment


class DreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dream
        fields = ['name', 'description', 'image', 'cost', 'status', 'category', 'location']

    category = serializers.ChoiceField(choices=Dream.Category.choices)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text']
