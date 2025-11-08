"""
Custom runserver command that uses port from settings
"""
from django.core.management.commands.runserver import Command as BaseRunserverCommand
from django.conf import settings


class Command(BaseRunserverCommand):
    help = 'Starts a lightweight Web server for development using configured port from settings'

    def handle(self, *args, **options):
        # Get host and port from settings if not explicitly provided
        addrport = options.get('addrport', None)
        
        if not addrport:
            # Use settings defaults
            host = getattr(settings, 'SERVER_HOST', '0.0.0.0')
            port = getattr(settings, 'SERVER_PORT', 9444)
            options['addrport'] = f"{host}:{port}"
        else:
            # If port only is provided (e.g., "9444"), add default host
            if ':' not in addrport:
                host = getattr(settings, 'SERVER_HOST', '127.0.0.1')
                options['addrport'] = f"{host}:{addrport}"
        
        # Display the server address
        final_addrport = options['addrport']
        if ':' in final_addrport:
            host, port = final_addrport.rsplit(':', 1)
        else:
            host = '127.0.0.1'
            port = final_addrport
        
        self.stdout.write(
            self.style.SUCCESS(f'Starting development server at http://{host}:{port}/')
        )
        
        # Call parent handle method
        super().handle(*args, **options)

