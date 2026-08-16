import httpx
import pytest

from backend.main import app


@pytest.mark.asyncio
async def test_health_and_playground_routes():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        health = await client.get("/api/health")
        assert health.status_code == 200
        assert health.json()["status"] == "ok"

        response = await client.post(
            "/api/playground",
            json={"prompt": "Return JSON", "params": {"temperature": 0, "max_tokens": 50, "top_p": 1}},
        )
        assert response.status_code == 200
        assert response.json()["provider"] == "mock-fallback"
        assert response.json()["output_tokens"] > 0
