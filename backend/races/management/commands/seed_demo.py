from datetime import date

from django.core.management.base import BaseCommand

from races.models import Race

DEMO_RACES = [
    {"name": "Media Maratón del Río", "date": date(2027, 3, 14), "location": "Zaragoza"},
    {"name": "10K Nocturna del Puerto", "date": date(2027, 6, 19), "location": "Málaga"},
    {"name": "Maratón de la Ciudad", "date": date(2027, 11, 7), "location": "Valladolid"},
]


class Command(BaseCommand):
    help = "Crea las carreras de ejemplo si todavía no existen."

    def handle(self, *args, **options):
        for data in DEMO_RACES:
            race, created = Race.objects.get_or_create(name=data["name"], defaults=data)
            verb = "Creada" if created else "Ya existía"
            self.stdout.write(f"{verb}: {race}")
