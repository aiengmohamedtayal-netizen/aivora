from __future__ import annotations

import asyncio
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from .config import Settings, settings
from .metrics import aggregate_metrics, tokens_per_second
from .provider import ModelProvider
from .schemas import BenchmarkCase, CaseResult, Metrics
from .store import RunStore
from .validation import validate_output


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class BenchmarkRunner:
    def __init__(self, store: RunStore, provider: ModelProvider, config: Settings = settings):
        self.store = store
        self.provider = provider
        self.config = config

    def load_suite(self) -> list[BenchmarkCase]:
        path = Path(self.config.suite_path)
        if not path.is_absolute():
            path = Path.cwd() / path
        with path.open("r", encoding="utf-8") as handle:
            return [BenchmarkCase.model_validate(item) for item in json.load(handle)]

    def create_run(self, cases: list[BenchmarkCase]) -> str:
        run_id = str(uuid.uuid4())
        self.store.create(run_id, self.config.model_name, len(cases))
        return run_id

    async def execute(self, run_id: str, cases: list[BenchmarkCase]) -> None:
        self.store.update(run_id, status="running")
        results: list[dict] = []
        try:
            for index, case in enumerate(cases, start=1):
                messages = []
                if case.system_instruction:
                    messages.append({"role": "system", "content": case.system_instruction})
                messages.append({"role": "user", "content": case.prompt})
                from .schemas import Message
                typed_messages = [Message.model_validate(message) for message in messages]
                try:
                    response = await self.provider.generate(typed_messages, case.params)
                    validation = validate_output(case.validator, response.text, case.expected_keys)
                    metric = Metrics(
                        ttft_ms=response.ttft_ms,
                        total_latency_ms=response.total_latency_ms,
                        input_tokens=response.input_tokens,
                        output_tokens=response.output_tokens,
                        tokens_per_second=tokens_per_second(response.output_tokens, response.total_latency_ms),
                        validation_passed=validation.passed,
                        validation_message=validation.message,
                    )
                    result = CaseResult(
                        case_id=case.id,
                        case_name=case.name,
                        category=case.category,
                        output=response.text,
                        metrics=metric,
                    )
                except Exception as exc:  # resilience: keep the rest of the suite running
                    metric = Metrics(
                        total_latency_ms=0,
                        input_tokens=0,
                        output_tokens=0,
                        tokens_per_second=0,
                        validation_passed=False,
                        validation_message="Provider error",
                    )
                    result = CaseResult(
                        case_id=case.id,
                        case_name=case.name,
                        category=case.category,
                        output="",
                        metrics=metric,
                        error=str(exc),
                    )
                results.append(result.model_dump())
                aggregate = aggregate_metrics(results)
                self.store.update(
                    run_id,
                    completed_cases=index,
                    cases_json=json.dumps(results),
                    pass_rate=aggregate["pass_rate"],
                    average_latency_ms=aggregate["average_latency_ms"],
                    average_tokens_per_second=aggregate["average_tokens_per_second"],
                )
                await asyncio.sleep(0)
            self.store.update(run_id, status="completed", completed_at=utc_now())
        except Exception as exc:
            self.store.update(run_id, status="failed", completed_at=utc_now(), error=str(exc), cases_json=json.dumps(results))
