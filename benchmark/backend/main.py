from __future__ import annotations

import asyncio
import json
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, StreamingResponse

from .config import settings
from .metrics import tokens_per_second
from .provider import ModelProvider
from .runner import BenchmarkRunner
from .schemas import HealthResponse, Message, PlaygroundRequest, ProviderResponse, RunStartResponse, RunSummary
from .store import RunStore


app = FastAPI(title="Model Benchmark Lab", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = RunStore(settings.database_path)
provider = ModelProvider(settings)
runner = BenchmarkRunner(store, provider, settings)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", provider=provider.name, model_name=settings.model_name)


@app.get("/api/suite")
async def suite() -> list[dict]:
    return [case.model_dump() for case in runner.load_suite()]


@app.post("/api/playground", response_model=ProviderResponse)
async def playground(request: PlaygroundRequest) -> ProviderResponse:
    messages = []
    if request.system_instruction.strip():
        messages.append(Message(role="system", content=request.system_instruction))
    messages.append(Message(role="user", content=request.prompt))
    try:
        response = await provider.generate(messages, request.params)
        response.raw = {"validation": "not applicable", "mode": provider.name}
        return response
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/playground/stream")
async def playground_stream(request: PlaygroundRequest) -> StreamingResponse:
    messages = []
    if request.system_instruction.strip():
        messages.append(Message(role="system", content=request.system_instruction))
    messages.append(Message(role="user", content=request.prompt))

    async def event_stream():
        try:
            async for delta in provider.stream(messages, request.params):
                yield f"data: {json.dumps({'delta': delta})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/api/runs", response_model=RunStartResponse)
async def start_run(background_tasks: BackgroundTasks) -> RunStartResponse:
    cases = runner.load_suite()
    run_id = runner.create_run(cases)
    background_tasks.add_task(runner.execute, run_id, cases)
    return RunStartResponse(run_id=run_id, status="queued")


@app.get("/api/runs", response_model=list[RunSummary])
async def list_runs() -> list[RunSummary]:
    return [RunSummary.model_validate(item) for item in store.list()]


@app.get("/api/runs/{run_id}", response_model=RunSummary)
async def get_run(run_id: str) -> RunSummary:
    run = store.get(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Run not found")
    return RunSummary.model_validate(run)


@app.get("/api/export/{format}")
async def export_runs(format: str):
    if format == "json":
        return PlainTextResponse(store.export_json(), media_type="application/json", headers={"Content-Disposition": "attachment; filename=benchmark-runs.json"})
    if format == "csv":
        return PlainTextResponse(store.export_csv(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=benchmark-runs.csv"})
    raise HTTPException(status_code=400, detail="Format must be json or csv")


@app.on_event("startup")
async def startup_check() -> None:
    suite_file = Path(settings.suite_path)
    if not suite_file.is_absolute():
        suite_file = Path.cwd() / suite_file
    if not suite_file.exists():
        raise RuntimeError(f"Benchmark suite not found at {suite_file}")
