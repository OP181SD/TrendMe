"""Pure scoring. Port of src/lib/scoring.ts. Verifiable, tested in tests/test_pure.py.

Works on plain dicts (video-like) so it stays framework-free.
A video dict needs at least: views, engagementRate, platform, publishedAt,
and creator = {"followers": int}.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

AttractionTier = Literal["pepite", "breakout", "audience", "inconnu"]
Momentum = Literal["up", "down", "flat"]

_DAY_MS = 86_400_000


def _fr_num(n: float, max_frac: int) -> str:
    """Mimics Number.toLocaleString('fr-FR', {maximumFractionDigits}): space thousands, comma decimal."""
    rounded = round(n, max_frac)
    if rounded == int(rounded):
        s = f"{int(rounded):,}".replace(",", " ")
        return s
    s = f"{rounded:,.{max_frac}f}"
    int_part, _, frac = s.partition(".")
    frac = frac.rstrip("0")
    int_part = int_part.replace(",", " ")
    return f"{int_part},{frac}" if frac else int_part


def _pct(n: float) -> str:
    return _fr_num(n, 1)


def _ratio(n: float) -> str:
    return _fr_num(n, 1 if n < 10 else 0)


def percentile_rank(values: list[float], v: float) -> float:
    """Percentile rank in [0, 1]; ties share the average rank."""
    if len(values) <= 1:
        return 1.0
    below = sum(1 for x in values if x < v)
    equal = sum(1 for x in values if x == v)
    return (below + (equal - 1) / 2) / (len(values) - 1)


def views_per_follower(v: dict) -> float | None:
    followers = v["creator"]["followers"]
    return v["views"] / followers if followers > 0 else None


def attraction_tier(vfr: float | None) -> AttractionTier:
    if vfr is None:
        return "inconnu"
    if vfr >= 3:
        return "pepite"
    if vfr >= 1:
        return "breakout"
    return "audience"


def score_videos(videos: list[dict]) -> list[dict]:
    """Score /100 then sort desc. Mutates copies; returns new sorted list."""
    all_views = [v["views"] for v in videos]
    vfrs = [x for x in (views_per_follower(v) for v in videos) if x is not None]
    scored = []
    for v in videos:
        same = [o for o in videos if o["platform"] == v["platform"]]
        pool = same if len(same) >= 2 else videos
        eng_rank = percentile_rank([o["engagementRate"] for o in pool], v["engagementRate"])
        view_rank = percentile_rank(all_views, v["views"])
        vfr = views_per_follower(v)
        if vfr is not None:
            raw = 0.5 * percentile_rank(vfrs, vfr) + 0.3 * eng_rank + 0.2 * view_rank
            reason = f"Attraction {_ratio(vfr)}× la communauté, engagement {_pct(v['engagementRate'])} %."
        else:
            raw = 0.6 * eng_rank + 0.4 * view_rank
            reason = f"Engagement {_pct(v['engagementRate'])} % (abonnés inconnus)."
        out = {**v, "score": round(raw * 100), "scoreReason": reason}
        scored.append(out)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored


def _now_ms() -> float:
    return datetime.now(timezone.utc).timestamp() * 1000


def _published_ms(published_at: str) -> float:
    return datetime.fromisoformat(published_at.replace("Z", "+00:00")).timestamp() * 1000


def recency_factor(published_at: str, now: float | None = None) -> float:
    """1 (<=7d), 0.8 (<=30d), 0.5 (<=90d), 0.25 beyond."""
    now = _now_ms() if now is None else now
    days = (now - _published_ms(published_at)) / _DAY_MS
    if days <= 7:
        return 1.0
    if days <= 30:
        return 0.8
    if days <= 90:
        return 0.5
    return 0.25


def trend_score(v: dict, now: float | None = None) -> float:
    return v["score"] * recency_factor(v["publishedAt"], now)


def is_trending(v: dict, now: float | None = None) -> bool:
    return recency_factor(v["publishedAt"], now) >= 0.8 and v["score"] >= 60


def views_per_day(v: dict, now: float | None = None) -> float:
    now = _now_ms() if now is None else now
    days = max((now - _published_ms(v["publishedAt"])) / _DAY_MS, 0.5)
    return v["views"] / days


def views_momentum(v: dict, pool: list[dict], now: float | None = None) -> dict:
    now = _now_ms() if now is None else now
    same = [o for o in pool if o["platform"] == v["platform"]]
    base = same if len(same) >= 2 else pool
    per_day = views_per_day(v, now)
    if len(base) < 2:
        return {"momentum": "flat", "ratio": 1.0, "perDay": per_day}
    speeds = sorted(views_per_day(o, now) for o in base)
    mid = len(speeds) // 2
    median = speeds[mid] if len(speeds) % 2 else (speeds[mid - 1] + speeds[mid]) / 2
    if median <= 0:
        return {"momentum": "flat", "ratio": 1.0, "perDay": per_day}
    ratio = per_day / median
    mom = "up" if ratio >= 1.25 else "down" if ratio <= 0.8 else "flat"
    return {"momentum": mom, "ratio": ratio, "perDay": per_day}
