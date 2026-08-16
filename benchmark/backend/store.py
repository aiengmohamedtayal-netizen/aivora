from __future__ import annotations

import csv
import io
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


class RunStore:
    def __init__(self, database_path: str):
        self.database_path = Path(database_path)
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _init_db(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """CREATE TABLE IF NOT EXISTS runs (
                    run_id TEXT PRIMARY KEY,
                    status TEXT NOT NULL,
                    model_name TEXT NOT NULL,
                    started_at TEXT NOT NULL,
                    completed_at TEXT,
                    total_cases INTEGER NOT NULL,
                    completed_cases INTEGER NOT NULL DEFAULT 0,
                    pass_rate REAL NOT NULL DEFAULT 0,
                    average_latency_ms REAL NOT NULL DEFAULT 0,
                    average_tokens_per_second REAL NOT NULL DEFAULT 0,
                    cases_json TEXT NOT NULL DEFAULT '[]',
                    error TEXT
                )"""
            )

    def create(self, run_id: str, model_name: str, total_cases: int) -> None:
        with self._connect() as connection:
            connection.execute(
                "INSERT INTO runs (run_id,status,model_name,started_at,total_cases) VALUES (?, ?, ?, ?, ?)",
                (run_id, "queued", model_name, datetime.now(timezone.utc).isoformat(), total_cases),
            )

    def update(self, run_id: str, **fields: Any) -> None:
        if not fields:
            return
        columns = ", ".join(f"{key} = ?" for key in fields)
        values = list(fields.values()) + [run_id]
        with self._connect() as connection:
            connection.execute(f"UPDATE runs SET {columns} WHERE run_id = ?", values)

    def get(self, run_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute("SELECT * FROM runs WHERE run_id = ?", (run_id,)).fetchone()
        if row is None:
            return None
        result = dict(row)
        result["cases"] = json.loads(result.pop("cases_json") or "[]")
        return result

    def list(self, limit: int = 25) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute("SELECT * FROM runs ORDER BY started_at DESC LIMIT ?", (limit,)).fetchall()
        results = []
        for row in rows:
            result = dict(row)
            result["cases"] = json.loads(result.pop("cases_json") or "[]")
            results.append(result)
        return results

    def export_json(self, limit: int = 100) -> str:
        return json.dumps(self.list(limit), indent=2)

    def export_csv(self, limit: int = 100) -> str:
        runs = self.list(limit)
        output = io.StringIO()
        writer = csv.DictWriter(
            output,
            fieldnames=["run_id", "status", "model_name", "started_at", "completed_at", "total_cases", "completed_cases", "pass_rate", "average_latency_ms", "average_tokens_per_second", "error"],
        )
        writer.writeheader()
        for run in runs:
            writer.writerow({key: run.get(key, "") for key in writer.fieldnames})
        return output.getvalue()
