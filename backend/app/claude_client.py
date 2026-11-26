"""Seul fichier qui sait appeler Claude (SDK Anthropic, serveur uniquement, clé ANTHROPIC_API_KEY).
Port of src/lib/claude.server.ts. Modèle swappable ici.
"""
from __future__ import annotations

import json
import re
from typing import Callable, TypeVar

from anthropic import AsyncAnthropic

MODEL = "claude-sonnet-5-5"

T = TypeVar("T")
_client: AsyncAnthropic | None = None
_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.IGNORECASE)


def _get_client() -> AsyncAnthropic:
    global _client
    if _client is None:
        _client = AsyncAnthropic()
    return _client


async def _call(system: str, user: str) -> str:
    res = await _get_client().messages.create(
        model=MODEL,
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return "".join(b.text for b in res.content if b.type == "text")


def _parse_json(text: str):
    t = text.strip()
    t = _FENCE.sub("", t).strip()
    return json.loads(t)


async def claude_json(system: str, user: str, validate: Callable[[object], T]) -> T:
    """Appelle Claude et valide le JSON ; une seule nouvelle tentative si invalide."""
    last_err: Exception | None = None
    for attempt in range(2):
        prompt = user if attempt == 0 else (
            f"{user}\n\nTa réponse précédente n'était pas un JSON valide. Réponds uniquement avec le JSON."
        )
        text = await _call(system, prompt)
        try:
            return validate(_parse_json(text))
        except Exception as e:
            last_err = e
            print("JSON Claude invalide, tentative", attempt + 1)
    raise last_err or ValueError("JSON invalide")
