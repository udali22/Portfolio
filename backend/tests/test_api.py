from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "healthy"


def test_profile():
    response = client.get("/api/profile")

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, dict)


def test_projects():
    response = client.get("/api/projects")

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
