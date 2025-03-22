from typing import Type, Any

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from dream.models import UserFavorites

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_favorites(
    sender: Type[User], instance: User, created: bool, **kwargs: Any
) -> None:
    if created:
        UserFavorites.objects.create(user=instance)
