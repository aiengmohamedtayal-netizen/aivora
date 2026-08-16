from __future__ import annotations

import re


_TOKEN_PATTERN = re.compile(r"\w+|[^\w\s]", re.UNICODE)


def estimate_tokens(text: str) -> int:
    """Fast, dependency-free approximation suitable for relative benchmarking."""
    if not text:
        return 0
    return max(1, len(_TOKEN_PATTERN.findall(text)))


def tokens_per_second(output_tokens: int, total_latency_ms: float) -> float:
    if output_tokens <= 0 or total_latency_ms <= 0:
        return 0.0
    return round(output_tokens / (total_latency_ms / 1000), 2)


def aggregate_metrics(results: list[dict]) -> dict[str, float]:
    if not results:
        return {
            "pass_rate": 0.0,
            "average_latency_ms": 0.0,
            "average_tokens_per_second": 0.0,
        }
    passed = sum(1 for result in results if result["metrics"]["validation_passed"])
    latency = sum(result["metrics"]["total_latency_ms"] for result in results)
    speed = sum(result["metrics"]["tokens_per_second"] for result in results)
    count = len(results)
    return {
        "pass_rate": round(passed / count * 100, 1),
        "average_latency_ms": round(latency / count, 1),
        "average_tokens_per_second": round(speed / count, 2),
    }
