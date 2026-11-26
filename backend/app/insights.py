"""Pure aggregated insights. Port of src/lib/insights.ts. Tested in tests/test_pure.py."""
from __future__ import annotations

import math
from typing import Optional

HOOK_LABEL = {
    "question": "hook question",
    "choc": "hook choc",
    "promesse": "hook promesse",
    "visuel": "hook visuel",
}


def hook_label(t: str) -> str:
    return HOOK_LABEL[t]


def _shares(values: list[str]) -> list[dict]:
    counts: dict[str, int] = {}
    for v in values:
        counts[v] = counts.get(v, 0) + 1
    total = len(values)
    out = [
        {"label": label, "count": c, "percent": round(c / total * 100) if total else 0}
        for label, c in counts.items()
    ]
    out.sort(key=lambda s: (-s["count"], s["label"]))
    return out


def _avg(xs: list[float]) -> float:
    return sum(xs) / len(xs) if xs else 0.0


def compute_insights(videos: list[dict], analyses: dict[str, Optional[dict]]) -> dict:
    """Top = upper half by score (>=1). Hook/format shares over analysed top videos."""
    sorted_v = sorted(videos, key=lambda v: v["score"], reverse=True)
    top_n = max(1, math.ceil(len(sorted_v) / 2))
    top = sorted_v[:top_n]
    rest = sorted_v[len(top):]
    top_analysed = [a for a in (analyses.get(v["id"]) for v in top) if a]
    hook_types = _shares([HOOK_LABEL[a["hook"]["type"]] for a in top_analysed])
    formats = _shares([a["format"] for a in top_analysed])
    lead = hook_types[0] if hook_types else None
    return {
        "topCount": len(top),
        "analysedCount": len(top_analysed),
        "hookTypes": hook_types,
        "formats": formats,
        "platforms": _shares([v["platform"] for v in top]),
        "avgEngagementTop": _avg([v["engagementRate"] for v in top]),
        "avgEngagementRest": _avg([v["engagementRate"] for v in rest]),
        "headline": f"{lead['percent']} % des meilleures vidéos utilisent un {lead['label']}" if lead else None,
    }
