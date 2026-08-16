# Model Benchmark Lab

Model Benchmark Lab is a minimal, modular evaluation console for an OpenAI-compatible AI model. It combines a FastAPI service, a lightweight React/Vite dashboard, SQLite run history, and a JSON-defined benchmark suite. The application is intentionally mock-first: it runs without credentials so the complete workflow can be inspected locally before connecting a model.

## Quick start

From this directory, copy `.env.example` to `.env`, optionally set `MODEL_API_BASE_URL`, `MODEL_API_KEY`, and `MODEL_NAME`, then run:

```bash
./start.sh
```

Open [http://localhost:5173](http://localhost:5173). The FastAPI API runs at [http://localhost:8000](http://localhost:8000), with interactive API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

The launcher creates a local Python virtual environment, installs backend requirements when needed, installs frontend dependencies when needed, and starts both processes. The default provider is a deterministic mock fallback. For a remote provider, set `MODEL_API_BASE_URL` to an OpenAI-compatible base URL such as `https://example.com/v1`, set `MODEL_API_KEY`, and set `MODEL_NAME` to the deployed model identifier.

## Project layout

| Path | Responsibility |
| --- | --- |
| `backend/provider.py` | Model client abstraction, streaming, timeout/rate-limit errors, mock fallback |
| `backend/validation.py` | Independent validators for code, math, JSON, context, and text |
| `backend/metrics.py` | Token estimation, TTFT/latency-derived throughput, aggregate metrics |
| `backend/runner.py` | Suite loading, asynchronous execution, per-case resilience, persistence |
| `backend/store.py` | SQLite run history plus JSON/CSV serialization |
| `backend/main.py` | FastAPI routes and SSE playground stream |
| `frontend/src/App.tsx` | Playground, benchmark controls, live polling, tables, and exports |
| `data/benchmark_suite.json` | Five default benchmark scenarios |
| `tests/` | Unit tests for core calculations, validation, provider, and persistence |

## Adding a benchmark case

Add an object to `data/benchmark_suite.json` with a unique `id`, a human-readable `name`, `category`, `description`, `prompt`, optional `system_instruction`, generation `params`, and one validator name. Supported validators are `code`, `math`, `json`, `context`, and `text`. JSON cases can declare `expected_keys`; the validator requires those keys to be present in the returned root object. The runner continues after an individual provider failure and records the error on that case.

## Interpreting results

**TTFT** is time to first streamed text delta. **Total latency** covers the complete provider response. **Tokens / second** is estimated output tokens divided by total latency, which makes it useful for relative comparisons even when the provider does not return tokenizer usage. The dashboard reports the same method consistently for all cases. Validation is a targeted structural check, not a claim that the answer is factually correct; pair the pass rate with manual review for production decisions.

## API surface

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Provider and model status |
| `GET` | `/api/suite` | Current benchmark manifest |
| `POST` | `/api/playground` | Non-streaming playground response with measurements |
| `POST` | `/api/playground/stream` | Server-sent events for live response rendering |
| `POST` | `/api/runs` | Queue the full suite |
| `GET` | `/api/runs/{run_id}` | Poll one run, including case results |
| `GET` | `/api/runs` | List recent runs |
| `GET` | `/api/export/json` | Download run history as JSON |
| `GET` | `/api/export/csv` | Download run summaries as CSV |

## Verification

```bash
cd benchmark
python -m pytest -q
npm --prefix frontend install
npm --prefix frontend run build
```

The SQLite database is created at `data/benchmark.db` by default and is ignored by Git. The frontend uses a development proxy for `/api`; production deployments can serve the built `frontend/dist` directory from the hosting layer or place it behind the same reverse proxy as FastAPI.
