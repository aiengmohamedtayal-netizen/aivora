#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
if ! python - <<'PY'
import importlib.util
missing = [name for name in ("fastapi", "httpx", "pydantic", "uvicorn") if importlib.util.find_spec(name) is None]
raise SystemExit(1 if missing else 0)
PY
then
  python -m pip install -r requirements.txt
fi

if [[ ! -d frontend/node_modules ]]; then
  npm --prefix frontend install
fi

if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

cleanup() {
  kill 0 2>/dev/null || true
}
trap cleanup INT TERM EXIT

(cd "$ROOT" && uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000) &
(cd "$ROOT/frontend" && npm run dev -- --host 127.0.0.1) &
wait
