import os
import uuid

from django.db import models
from django.utils.text import slugify

from user.models import User


def movie_image_file_path(instance, filename) -> str:
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"

    return os.path.join("uploads/movies/", filename)


class Dream(models.Model):
    class Category(models.TextChoices):
        MONEY = "Money donation"
        SERVICES = "Volunteer services"
        GIFTS = "Gifts"
    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to=movie_image_file_path)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cost = models.PositiveIntegerField(null=True, blank=True)
    status = models.BooleanField(default=False)
    category = models.CharField(choices=Category.choices)
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
