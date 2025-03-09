from typing import Type

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Contribution


@receiver(post_save, sender=Contribution)
def send_contribution_notification(
        sender: Type[Contribution],
        instance: Contribution,
        created: bool,
        *args,
        **kwargs
) -> None:
    if created:
        dream_owner = instance.dream.user
        contributor = instance.user
        subject = 'New Contribution to Your Dream!'
        message = (
            f'Hello {dream_owner.first_name},\n\n'
            f'You have received a new contribution for your dream "{instance.dream.name}".\n\n'
            f'Description: {instance.description}\n\n'
            f"Contributor's profile: {settings.SITE_URL}/profile/{contributor.id}/\n\n"
            f'Best regards,\nDream Site Team'
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [dream_owner.email])
