from __future__ import annotations

import ast
import json
import re
from dataclasses import dataclass


@dataclass(frozen=True)
class ValidationResult:
    passed: bool
    message: str


def _strip_code_fence(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines and lines[-1].strip() == "```":
            return "\n".join(lines[1:-1]).strip()
    return cleaned


def validate_code(text: str) -> ValidationResult:
    source = _strip_code_fence(text)
    if not source:
        return ValidationResult(False, "No code was returned")
    try:
        ast.parse(source)
        return ValidationResult(True, "Valid Python syntax")
    except SyntaxError as exc:
        return ValidationResult(False, f"Syntax error: line {exc.lineno or '?'}")


def validate_math(text: str) -> ValidationResult:
    normalized = text.replace(",", "")
    has_answer = bool(re.search(r"(?:answer|result|equals|=)\s*[:=]?\s*-?\d+(?:\.\d+)?", normalized, re.I))
    has_number = bool(re.search(r"-?\d+(?:\.\d+)?", normalized))
    return ValidationResult(has_answer and has_number, "Contains a numeric answer" if has_answer else "No explicit numeric answer found")


def validate_json(text: str, expected_keys: list[str]) -> ValidationResult:
    candidate = _strip_code_fence(text)
    try:
        payload = json.loads(candidate)
    except json.JSONDecodeError as exc:
        return ValidationResult(False, f"Malformed JSON: {exc.msg}")
    if not isinstance(payload, dict):
        return ValidationResult(False, "JSON root must be an object")
    missing = [key for key in expected_keys if key not in payload]
    if missing:
        return ValidationResult(False, f"Missing keys: {', '.join(missing)}")
    return ValidationResult(True, "Valid JSON object with required keys")


def validate_context(text: str) -> ValidationResult:
    return ValidationResult(len(text.strip()) > 0, "Context response received" if text.strip() else "Empty response")


def validate_text(text: str) -> ValidationResult:
    return ValidationResult(len(text.strip()) >= 20, "Substantive response received" if len(text.strip()) >= 20 else "Response is too short")


def validate_output(validator: str, text: str, expected_keys: list[str] | None = None) -> ValidationResult:
    validators = {
        "code": validate_code,
        "math": validate_math,
        "json": lambda value: validate_json(value, expected_keys or []),
        "context": validate_context,
        "text": validate_text,
    }
    return validators.get(validator, validate_text)(text)
