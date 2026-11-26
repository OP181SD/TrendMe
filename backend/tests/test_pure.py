"""Runnable checks for the pure modules (scoring + insights). `python -m pytest` or run directly."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from datetime import UTC

from app.insights import compute_insights
from app.scoring import percentile_rank, recency_factor, score_videos, views_momentum


def _vid(id, views, eng, followers, platform="tiktok", published="2026-11-20T00:00:00+00:00"):
    return {
        "id": id, "platform": platform, "views": views, "engagementRate": eng,
        "creator": {"followers": followers}, "publishedAt": published,
    }


def test_percentile_rank_ties():
    assert percentile_rank([1], 1) == 1.0

    assert percentile_rank([10, 10, 20], 10) == 0.25
    assert percentile_rank([10, 20, 30], 30) == 1.0


def test_score_videos_sorted_and_bounded():
    vids = [_vid("a", 1000, 5, 100), _vid("b", 50, 20, 10), _vid("c", 100, 1, 0)]
    out = score_videos(vids)
    scores = [v["score"] for v in out]
    assert scores == sorted(scores, reverse=True)
    assert all(0 <= s <= 100 for s in scores)
    assert all("scoreReason" in v for v in out)

    assert any("inconnus" in v["scoreReason"] for v in out if v["id"] == "c")


def test_recency_factor_buckets():
    now = recency_factor.__globals__["_now_ms"]()
    day = 86_400_000
    from datetime import datetime

    def iso(days_ago):
        return datetime.fromtimestamp((now - days_ago * day) / 1000, UTC).isoformat()

    assert recency_factor(iso(3), now) == 1.0
    assert recency_factor(iso(20), now) == 0.8
    assert recency_factor(iso(60), now) == 0.5
    assert recency_factor(iso(200), now) == 0.25


def test_momentum_up_down():
    pool = [_vid("slow", 10, 1, 100), _vid("mid", 100, 1, 100), _vid("fast", 10000, 1, 100)]
    assert views_momentum(pool[2], pool)["momentum"] == "up"
    assert views_momentum(pool[0], pool)["momentum"] == "down"


def test_compute_insights_headline():
    vids = [dict(_vid("a", 1000, 5, 100), score=90), dict(_vid("b", 50, 2, 10), score=20)]
    analyses = {"a": {"format": "UGC", "hook": {"type": "question"}}}
    ins = compute_insights(vids, analyses)
    assert ins["topCount"] == 1
    assert ins["analysedCount"] == 1
    assert ins["headline"] == "100 % des meilleures vidéos utilisent un hook question"


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
    print("all passed")
