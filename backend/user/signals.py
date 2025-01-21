from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from dream.models import UserFavorites

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_favorites(sender, instance, created, **kwargs):
    if created:
        UserFavorites.objects.create(user=instance)
