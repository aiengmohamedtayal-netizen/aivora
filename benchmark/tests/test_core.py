import pytest

from backend.config import Settings
from backend.metrics import aggregate_metrics, estimate_tokens, tokens_per_second
from backend.provider import ModelProvider
from backend.schemas import GenerationParams, Message
from backend.store import RunStore
from backend.validation import validate_output


def test_estimate_tokens_and_speed_are_stable():
    assert estimate_tokens("hello, world!") == 4
    assert tokens_per_second(20, 2000) == 10.0
    summary = aggregate_metrics([
        {"metrics": {"validation_passed": True, "total_latency_ms": 100, "tokens_per_second": 20}},
        {"metrics": {"validation_passed": False, "total_latency_ms": 300, "tokens_per_second": 10}},
    ])
    assert summary == {"pass_rate": 50.0, "average_latency_ms": 200.0, "average_tokens_per_second": 15.0}


def test_validators_handle_common_model_output_shapes():
    assert validate_output("code", "def add(a, b):\n    return a + b").passed
    assert validate_output("math", "Answer: 42").passed
    assert validate_output("json", '{"name":"Atlas","price":24.5}', ["name", "price"]).passed
    assert not validate_output("json", "not json", ["name"]).passed
    assert not validate_output("text", "tiny").passed


@pytest.mark.asyncio
async def test_mock_provider_generates_measured_output():
    settings = Settings(model_name="test-mock", api_base_url="", api_key="")
    provider = ModelProvider(settings)
    result = await provider.generate([Message(role="user", content="Return JSON")], GenerationParams())
    assert provider.name == "mock-fallback"
    assert result.output_tokens > 0
    assert result.total_latency_ms >= 0
    assert result.ttft_ms is not None
    assert result.text.startswith("{")


def test_store_round_trips_runs(tmp_path):
    store = RunStore(str(tmp_path / "runs.db"))
    store.create("run-1", "test", 1)
    store.update("run-1", status="completed", cases_json="[]", pass_rate=100, completed_cases=1)
    record = store.get("run-1")
    assert record["status"] == "completed"
    assert record["cases"] == []
    assert store.export_csv().startswith("run_id,status")
