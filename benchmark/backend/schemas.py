from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field


class GenerationParams(BaseModel):
    temperature: float = Field(default=0.2, ge=0, le=2)
    max_tokens: int = Field(default=512, ge=1, le=32768)
    top_p: float = Field(default=0.95, gt=0, le=1)


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class PlaygroundRequest(BaseModel):
    prompt: str = Field(min_length=1)
    system_instruction: str = ""
    params: GenerationParams = Field(default_factory=GenerationParams)


class BenchmarkCase(BaseModel):
    id: str
    name: str
    category: str
    description: str
    system_instruction: str = ""
    prompt: str
    params: GenerationParams = Field(default_factory=GenerationParams)
    validator: Literal["code", "math", "json", "context", "text"] = "text"
    expected_keys: list[str] = Field(default_factory=list)


class Metrics(BaseModel):
    ttft_ms: float | None = None
    total_latency_ms: float
    input_tokens: int
    output_tokens: int
    tokens_per_second: float
    validation_passed: bool
    validation_message: str


class CaseResult(BaseModel):
    case_id: str
    case_name: str
    category: str
    output: str
    metrics: Metrics
    error: str | None = None


class RunSummary(BaseModel):
    run_id: str
    status: Literal["queued", "running", "completed", "failed"]
    model_name: str
    started_at: str
    completed_at: str | None = None
    total_cases: int
    completed_cases: int
    pass_rate: float
    average_latency_ms: float
    average_tokens_per_second: float
    cases: list[CaseResult] = Field(default_factory=list)
    error: str | None = None


class RunStartResponse(BaseModel):
    run_id: str
    status: str


class HealthResponse(BaseModel):
    status: str
    provider: str
    model_name: str


class ProviderResponse(BaseModel):
    text: str
    input_tokens: int
    output_tokens: int
    ttft_ms: float | None
    total_latency_ms: float
    provider: str
    raw: dict[str, Any] = Field(default_factory=dict)
