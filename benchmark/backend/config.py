from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    model_name: str = os.getenv("MODEL_NAME", "benchmark-mock")
    api_base_url: str = os.getenv("MODEL_API_BASE_URL", "")
    api_key: str = os.getenv("MODEL_API_KEY", "")
    request_timeout_seconds: float = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "45"))
    database_path: str = os.getenv("BENCHMARK_DB_PATH", "./data/benchmark.db")
    suite_path: str = os.getenv("BENCHMARK_SUITE_PATH", "./data/benchmark_suite.json")

    @property
    def is_configured(self) -> bool:
        return bool(self.api_base_url and self.api_key)


settings = Settings()
