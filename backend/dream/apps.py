from django.apps import AppConfig


class DreamConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dream'

    def ready(self) -> None:
        import dream.signals # noqa F401
