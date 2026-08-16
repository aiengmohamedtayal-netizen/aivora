from __future__ import annotations

import asyncio
import json
import time
from collections.abc import AsyncIterator

import httpx

from .config import Settings, settings
from .metrics import estimate_tokens
from .schemas import GenerationParams, Message, ProviderResponse


class ProviderError(RuntimeError):
    pass


class ModelProvider:
    def __init__(self, config: Settings = settings):
        self.config = config

    @property
    def name(self) -> str:
        return "openai-compatible" if self.config.is_configured else "mock-fallback"

    async def _mock_stream(self, messages: list[Message]) -> AsyncIterator[str]:
        prompt = messages[-1].content.lower()
        if "json" in prompt or "structured" in prompt:
            text = '{"summary":"Benchmark response","score":0.92,"tags":["evaluation","ai"]}'
        elif "python" in prompt or "code" in prompt:
            text = "def summarize(values):\n    return {\"count\": len(values), \"total\": sum(values)}"
        elif "math" in prompt or "calculate" in prompt or "equation" in prompt:
            text = "The result is 42. The calculation is shown step by step, and the final answer equals 42."
        else:
            text = "This mock response demonstrates the complete benchmark flow while no model credentials are configured."
        for index in range(0, len(text), 12):
            await asyncio.sleep(0.015)
            yield text[index:index + 12]

    def _endpoint(self) -> str:
        base = self.config.api_base_url.rstrip("/")
        if base.endswith("/chat/completions"):
            return base
        if base.endswith("/v1"):
            return f"{base}/chat/completions"
        return f"{base}/v1/chat/completions"

    async def _remote_stream(self, messages: list[Message], params: GenerationParams) -> AsyncIterator[str]:
        headers = {"Authorization": f"Bearer {self.config.api_key}", "Content-Type": "application/json"}
        payload = {
            "model": self.config.model_name,
            "messages": [message.model_dump() for message in messages],
            "temperature": params.temperature,
            "max_tokens": params.max_tokens,
            "top_p": params.top_p,
            "stream": True,
            "stream_options": {"include_usage": True},
        }
        timeout = httpx.Timeout(self.config.request_timeout_seconds, connect=10.0)
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                async with client.stream("POST", self._endpoint(), headers=headers, json=payload) as response:
                    if response.status_code == 429:
                        raise ProviderError("Rate limited by the model provider. Retry after a short delay.")
                    if response.status_code >= 400:
                        body = (await response.aread()).decode("utf-8", errors="replace")
                        raise ProviderError(f"Provider returned HTTP {response.status_code}: {body[:240]}")
                    async for line in response.aiter_lines():
                        if not line.startswith("data:"):
                            continue
                        data = line[5:].strip()
                        if data == "[DONE]":
                            break
                        try:
                            chunk = json.loads(data)
                        except json.JSONDecodeError:
                            continue
                        choices = chunk.get("choices") or []
                        if choices:
                            delta = choices[0].get("delta", {}).get("content") or ""
                            if delta:
                                yield delta
        except httpx.TimeoutException as exc:
            raise ProviderError("Model request timed out. Try a smaller prompt or lower max_tokens.") from exc
        except httpx.HTTPError as exc:
            raise ProviderError(f"Model request failed: {exc}") from exc

    async def stream(self, messages: list[Message], params: GenerationParams) -> AsyncIterator[str]:
        if self.config.is_configured:
            async for delta in self._remote_stream(messages, params):
                yield delta
        else:
            async for delta in self._mock_stream(messages):
                yield delta

    async def generate(self, messages: list[Message], params: GenerationParams) -> ProviderResponse:
        started = time.perf_counter()
        first_token_at: float | None = None
        chunks: list[str] = []
        async for delta in self.stream(messages, params):
            if first_token_at is None:
                first_token_at = time.perf_counter()
            chunks.append(delta)
        finished = time.perf_counter()
        text = "".join(chunks)
        return ProviderResponse(
            text=text,
            input_tokens=estimate_tokens(" ".join(message.content for message in messages)),
            output_tokens=estimate_tokens(text),
            ttft_ms=round((first_token_at - started) * 1000, 1) if first_token_at else None,
            total_latency_ms=round((finished - started) * 1000, 1),
            provider=self.name,
        )
