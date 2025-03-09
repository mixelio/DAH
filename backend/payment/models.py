from django.db import models


class Payment(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING'
        PAID = 'PAID'
    user_id = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=StatusChoices.choices)
    dream_id = models.PositiveIntegerField()
    session_url = models.URLField(max_length=500)
    session_id = models.CharField(max_length=100)
    money_to_pay = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return f'{self.id}: {self.status}'

