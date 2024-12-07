from cloudinary.models import CloudinaryField
from django.db import models

from user.models import User


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
    image = CloudinaryField('image', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cost = models.PositiveIntegerField(null=True, blank=True)
    accumulated = models.PositiveIntegerField(null=True, blank=True, default=0)
    status = models.CharField(choices=Status.choices, default=Status.NEW, max_length=15)
    category = models.CharField(choices=Category.choices, max_length=50)
    date_added = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=200)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-date_added']

    def __str__(self) -> str:
        return self.name


class Comment(models.Model):
    dream = models.ForeignKey(Dream, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.text


class Contribution(models.Model):
    dream = models.ForeignKey(Dream, on_delete=models.CASCADE, related_name="contributions")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self) -> str:
        return f'{self.user.email} - {self.dream.name}'
