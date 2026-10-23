import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api():
    return APIClient()


def test_create_race(api, db):
    response = api.post(
        "/api/races/", {"name": "San Silvestre", "date": "2027-12-31", "location": "Teruel"}
    )

    assert response.status_code == 201
    assert response.json()["name"] == "San Silvestre"


def test_create_race_requires_name_and_date(api, db):
    response = api.post("/api/races/", {"location": "Teruel"})

    assert response.status_code == 400
    assert set(response.json()) == {"name", "date"}


def test_list_races_by_date(api, race):
    api.post("/api/races/", {"name": "Cross de invierno", "date": "2027-01-10"})

    names = [r["name"] for r in api.get("/api/races/").json()]

    assert names == ["Cross de invierno", race.name]


def test_race_detail(api, race):
    response = api.get(f"/api/races/{race.pk}/")

    assert response.status_code == 200
    assert response.json()["date"] == "2027-03-14"
