import os
from pathlib import Path

PROMPTS_DIR = Path(__file__).parent

def load_prompt(filename: str) -> str:
    """Loads a prompt from a markdown file in the prompts directory."""
    filepath = PROMPTS_DIR / filename
    if not filepath.exists():
        raise FileNotFoundError(f"Prompt file not found: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read().strip()

class PromptComposer:
    @staticmethod
    def get_workspace_system_prompt() -> str:
        """Composes the main system prompt for the AI workspace."""
        parts = [
            load_prompt("system.md"),
            load_prompt("engineering.md"),
            load_prompt("formatting.md")
        ]
        return "\n\n".join(parts)
