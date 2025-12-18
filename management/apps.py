from django.apps import AppConfig


class ManagementConfig(AppConfig):
    name = 'management'
    
    def ready(self):
        """Import signals when app is ready"""
        import management.models  # noqa - This ensures signals are registered