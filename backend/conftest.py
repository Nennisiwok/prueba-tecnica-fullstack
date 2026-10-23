from datetime import date

import pytest

from races.models import Race


@pytest.fixture(autouse=True)
def media_root(settings, tmp_path):
    settings.MEDIA_ROOT = tmp_path / "media"


@pytest.fixture(autouse=True)
def celery_eager(settings):
    """Las tareas se ejecutan dentro del test aunque haya un worker (por ejemplo, en Docker)."""
    settings.CELERY_TASK_ALWAYS_EAGER = True
    settings.CELERY_TASK_EAGER_PROPAGATES = True


@pytest.fixture
def race(db):
    return Race.objects.create(name="Trail de prueba", date=date(2027, 3, 14), location="Huesca")
