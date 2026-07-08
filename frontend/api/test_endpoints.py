from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
    print("Health check passed.")

def test_openapi():
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    print("OpenAPI schema passed.")

if __name__ == "__main__":
    test_health()
    test_openapi()
