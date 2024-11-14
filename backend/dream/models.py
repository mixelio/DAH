import os
import uuid

from django.db import models
from django.utils.text import slugify

from user.models import User


def dream_image_file_path(instance, filename) -> str:
    _, extension = os.path.splitext(filename)
    filename = f'{slugify(instance.name)}-{uuid.uuid4()}{extension}'

    return os.path.join('uploads/dreams/', filename)


class Dream(models.Model):
    class Category(models.TextChoices):
        MONEY = 'Money donation'
        SERVICES = 'Volunteer services'
        GIFTS = 'Gifts'

    class Status(models.TextChoices):
        NEW = 'New'
        PENDING = 'Pending'
        COMPLETED = 'Completed'

    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to=dream_image_file_path, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cost = models.PositiveIntegerField(null=True, blank=True)
    accumulated = models.PositiveIntegerField(null=True, blank=True, default=0)
    status = models.CharField(choices=Status.choices, default=Status.NEW, max_length=15)
    category = models.CharField(choices=Category.choices, max_length=50)
    date_added = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=200)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return self.name


class Comment(models.Model):
    dream = models.ForeignKey(Dream, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return self.text


class Contribution(models.Model):
    dream = models.ForeignKey(Dream, on_delete=models.CASCADE, related_name="contributions")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.dream.name}"
