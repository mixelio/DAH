from cloudinary.models import CloudinaryField
from django.db import models

from user.models import User


class Dream(models.Model):
    class Category(models.TextChoices):
        MONEY = 'Money_donation'
        SERVICES = 'Volunteer_services'
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
    status = models.CharField(
        choices=Status.choices, default=Status.NEW, max_length=15
    )
    category = models.CharField(choices=Category.choices, max_length=50)
    date_added = models.DateField(auto_now_add=True)
    location = models.CharField(max_length=200)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-date_added', '-id']

    def __str__(self) -> str:
        return self.name

    def update_accumulated(self, amount: int = 0) -> None:
        """
        Update the accumulated amount and adjust the status of the dream.
        """
        if self.category == Dream.Category.MONEY:

            self.accumulated += amount

            if self.accumulated >= self.cost:
                self.status = self.Status.COMPLETED
            elif self.accumulated > 0:
                self.status = self.Status.PENDING
            else:
                self.status = self.Status.NEW

            self.save(update_fields=['accumulated', 'status'])


class Comment(models.Model):
    dream = models.ForeignKey(Dream, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.text


class Contribution(models.Model):
    dream = models.ForeignKey(
        Dream, on_delete=models.CASCADE, related_name='contributions'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self) -> str:
        return f'{self.user.email} - {self.dream.name}'


class UserFavorites(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='favorites'
    )
    dreams = models.ManyToManyField(Dream, related_name='favorited_by')

    def __str__(self) -> str:
        return f'Favorites of {self.user.email}'
