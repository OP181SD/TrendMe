"""SEUL fichier qui connaît l'API Oriane : URL, format de requête, format de réponse.
Pour changer de fournisseur ou de format, ne modifier que ce fichier.
Port of src/lib/oriane.server.ts.
"""
from __future__ import annotations

import os
import re
from datetime import datetime, timezone
from typing import Optional

import httpx


class ImageSearchUnsupported(Exception):
    """Oriane n'accepte pas l'image fournie (format, taille ou fonction indisponible)."""


def _build_url(r: dict) -> str:
    handle = r.get("profileHandle") or ""
    pid = r.get("platformId") or ""
    p = r.get("platform")
    if p == "tiktok":
        return f"https://www.tiktok.com/@{handle}/video/{pid}"
    if p == "instagram":
        return f"https://www.instagram.com/reel/{pid}/"
    if p == "youtube":
        return f"https://www.youtube.com/shorts/{pid}"
    return ""


def normalize_oriane(r: dict) -> Optional[dict]:
    """Normalise un résultat Oriane en RawVideo (sans score). None si inexploitable."""
    if r.get("platform") not in ("tiktok", "instagram", "youtube"):
        return None
    views = r.get("viewsCount") or 0
    if views <= 0:
        return None
    likes = r.get("likesCount") or 0
    comments = r.get("commentsCount") or 0
    shares = r.get("sharesCount") or 0
    er = r.get("engagementRatePerViews")
    provided = isinstance(er, (int, float)) and math_isfinite(er)
    media_list = r.get("media") or []
    media = media_list[0] if media_list else {}
    on_screen = [t for t in (media.get("onScreenText") or []) if t]
    return {
        "id": r["id"],
        "platform": r["platform"],
        "url": _build_url(r),
        "thumbnailUrl": r.get("thumbnailMediaUrl") or "",
        "creator": {
            "handle": r.get("profileHandle") or "inconnu",
            "name": r.get("profileDisplayName") or r.get("profileHandle") or "Inconnu",
            "followers": r.get("profileFollowersCount") or 0,
        },
        "publishedAt": r.get("publishedAt") or datetime.now(timezone.utc).isoformat(),
        "durationSeconds": round(media.get("duration") or 0),
        "views": views,
        "likes": likes,
        "comments": comments,
        "shares": shares,
        # En pourcentage. Fourni par Oriane si possible, sinon calculé.
        "engagementRate": er if provided else ((likes + comments + shares) / views) * 100,
        "providedEngagement": provided,
        "caption": r.get("caption") or "",
        "transcript": media.get("transcript") or "",
        "onScreenText": on_screen,
        "hashtags": r.get("hashtags") or [],
    }


def math_isfinite(x: float) -> bool:
    return x == x and x not in (float("inf"), float("-inf"))


_SPLIT = re.compile(r"[,.;:!?()]| au | aux | avec | pour | à base | de \d", re.IGNORECASE)


async def search_oriane(
    query: str,
    limit: int,
    platform: Optional[str] = None,
    image: Optional[dict] = None,
) -> list[dict]:
    base_url = re.sub(r"\s+", "", os.environ.get("ORIANE_API_URL", ""))
    api_key = (os.environ.get("ORIANE_API_KEY") or "").strip()
    if not base_url or not api_key:
        raise RuntimeError("Oriane non configuré")
    if not re.match(r"^https?://", base_url):
        base_url = f"https://{base_url}"
    try:
        host = httpx.URL(base_url).host
        if "." not in host:
            raise ValueError
    except Exception:
        raise RuntimeError("ORIANE_API_URL n'est pas une adresse valide")

    full = query.strip().lower()[:200]
    head = _SPLIT.split(full)[0].strip()
    terms = []
    for t in (full, head, " ".join(head.split()[:2])):
        if len(t) >= 3 and t not in terms:
            terms.append(t)
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    root = base_url.rstrip("/")

    async with httpx.AsyncClient(timeout=30) as http:
        # Recherche par image : créer un asset image, puis filtrer par similarité visuelle.
        asset_id: Optional[str] = None
        if image:
            ok = False
            try:
                r = await http.post(
                    f"{root}/assets",
                    headers=headers,
                    json={"type": "image", "image": {"type": "base64", "mediaType": image["mediaType"], "base64": image["base64"]}},
                )
                if r.status_code < 400:
                    asset_id = (r.json().get("data") or {}).get("id")
                    ok = bool(asset_id)
                else:
                    print("Oriane asset image HTTP", r.status_code)
            except Exception:
                pass
            if not ok:
                raise ImageSearchUnsupported()

        async def fetch_term(term: Optional[str]) -> list[dict]:
            query_filters = {}
            if term is not None:
                query_filters = {
                    "caption": {"includesExactly": {"values": [term]}},
                    "transcript": {"includesExactly": {"values": [term]}},
                    "onScreenText": {"includesExactly": {"values": [term]}},
                }
            filters = {
                "format": {"includes": ["video"]},
                "platform": {"includes": [platform] if platform else ["tiktok", "instagram", "youtube"]},
            }
            if asset_id:
                filters["visualSimilarity"] = {"includes": {"values": [{"assetId": asset_id, "minScore": 0.2}]}}
            body = {
                "operator": "and",
                "filters": filters,
                "queries": [] if term is None else [{"operator": "or", "filters": query_filters}],
            }
            sort = "visualSimilarity:desc" if asset_id else "viewsCount:desc"
            url = f"{root}/contents/search?limit={limit}&sort={sort}"
            try:
                res = await http.post(url, headers=headers, json=body)
            except Exception:
                raise RuntimeError("Oriane injoignable")
            if res.status_code >= 400:
                raise RuntimeError(f"Oriane a répondu {res.status_code}")
            results = ((res.json().get("data") or {}).get("results")) or []
            return [v for v in (normalize_oriane(r) for r in results) if v is not None]

        for t in terms:
            found = await fetch_term(t)
            if found:
                return found
        return await fetch_term(None) if asset_id else []
