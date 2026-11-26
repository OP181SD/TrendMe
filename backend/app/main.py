"""FastAPI backend. Mirrors the TanStack server functions (search + AI) as HTTP endpoints.
Routes map 1:1 to src/lib/search.functions.ts and src/lib/ai.functions.ts.
"""
from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import ai_schema
from .claude_client import claude_json
from .db import admin
from .models import (
    Analysis,
    AnalyzeInput,
    GeneratedPrompt,
    GenerateInput,
    SaveForDemoInput,
    SaveResult,
    SearchInput,
    SearchResult,
    StoredAnalysisInput,
)
from .oriane import ImageSearchUnsupported, search_oriane
from .scoring import score_videos

load_dotenv()

_PROMPTS = Path(__file__).parent / "prompts"
ANALYZE_SYSTEM = (_PROMPTS / "analyze.system.txt").read_text(encoding="utf-8")
GENERATE_SYSTEM = (_PROMPTS / "generate.system.txt").read_text(encoding="utf-8")

app = FastAPI(title="TrendMe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", operation_id="health")
async def health():
    return {"ok": True}


@app.post("/search/videos", response_model=SearchResult, operation_id="searchVideos")
async def search_videos(data: SearchInput) -> SearchResult:
    db = admin()
    demo = data.demo is True or os.environ.get("DEMO_MODE") == "true"

    if not demo:
        try:
            base = {"query": data.query, "platform": data.platform, "limit": data.limit}
            image = data.image.model_dump() if data.image else None
            image_unsupported = False
            try:
                raw = await search_oriane(**base, image=image)
            except ImageSearchUnsupported:
                image_unsupported = True
                raw = await search_oriane(**base)
            image_used = bool(data.image) and not image_unsupported
            videos = score_videos([{k: v for k, v in r.items() if k != "providedEngagement"} for r in raw])
            s = db.table("searches").insert({
                "query": data.query, "platform": data.platform, "source": "oriane",
                "data": {"limit": data.limit, "count": len(videos)},
            }).execute()
            search_id = s.data[0]["id"] if s.data else None
            if videos:
                db.table("videos").upsert([
                    {"id": v["id"], "search_id": search_id, "query": data.query,
                     "platform": v["platform"], "score": v["score"], "data": v}
                    for v in videos
                ]).execute()
            return SearchResult(
                videos=videos, source="oriane", imageUsed=image_used, imageUnsupported=image_unsupported
            )
        except Exception as e:
            print("Recherche Oriane échouée:", str(e))
            return SearchResult(videos=[], source="oriane", error="La recherche de vidéos n'a pas abouti.")


    def read(pinned: bool) -> list[dict]:
        q = db.table("videos").select("data").order("created_at", desc=True).limit(50)
        if pinned:
            q = q.eq("pinned", True)
        if data.platform:
            q = q.eq("platform", data.platform)
        return [r["data"] for r in (q.execute().data or [])]

    stored = read(True) or read(False)
    return SearchResult(videos=score_videos(stored)[: data.limit], source="demo")


@app.post("/analyses/stored", operation_id="getStoredAnalysis", response_model=Analysis | None)
async def stored_analysis(data: StoredAnalysisInput):
    db = admin()
    res = (db.table("analyses").select("data").eq("video_id", data.videoId)
           .order("pinned", desc=True).order("created_at", desc=True).limit(1).execute())
    return (res.data[0]["data"] if res.data else None)


@app.post("/demo/save", operation_id="saveForDemo", response_model=SaveResult)
async def save_for_demo(data: SaveForDemoInput):
    if not data.videos or len(data.videos) > 20:
        raise ValueError("1 à 20 vidéos")
    db = admin()
    query = data.query[:500]
    s = db.table("searches").insert({
        "query": query, "source": "demo", "pinned": True, "data": {"count": len(data.videos)},
    }).execute()
    search_id = s.data[0]["id"] if s.data else None
    db.table("videos").upsert([
        {"id": v.id, "search_id": search_id, "query": query, "platform": v.platform,
         "score": v.score, "pinned": True, "data": v.model_dump()}
        for v in data.videos
    ]).execute()
    if data.analyses:
        db.table("analyses").insert([
            {"video_id": a.videoId, "pinned": True, "data": a.analysis.model_dump()}
            for a in data.analyses
        ]).execute()
    return {"videos": len(data.videos), "analyses": len(data.analyses)}


def _video_facts(v) -> dict:
    return {
        "plateforme": v.platform, "createur": v.creator.handle, "legende": v.caption,
        "transcription": v.transcript, "texte_a_l_ecran": v.onScreenText, "hashtags": v.hashtags,
        "duree_s": v.durationSeconds, "vues": v.views, "likes": v.likes, "commentaires": v.comments,
        "partages": v.shares, "engagement_pct": v.engagementRate,
    }


@app.post("/ai/analyze", operation_id="analyzeVideo", response_model=Analysis)
async def analyze_video(data: AnalyzeInput):
    import json
    p = data.product
    user = json.dumps({
        "video": _video_facts(data.video),
        "marque": p.brand.model_dump(),
        "produit": {"nom": p.name, "description": p.description},
    }, ensure_ascii=False, indent=2)
    analysis = await claude_json(ANALYZE_SYSTEM, user, ai_schema.validate_analysis)
    admin().table("analyses").insert({"video_id": data.video.id, "data": analysis}).execute()
    return analysis


@app.post("/ai/generate", operation_id="generateAdPrompt", response_model=GeneratedPrompt)
async def generate_ad_prompt(data: GenerateInput):
    import json
    if not data.analyses or len(data.analyses) > 3:
        raise ValueError("1 à 3 inspirations")
    p = data.product
    user = json.dumps({
        "outil_cible": data.tool,
        "produit": {"nom": p.name, "description": p.description},
        "marque": p.brand.model_dump(),
        "style": p.style.model_dump(),
        "inspirations": [
            {
                "format": a.format,
                "hook": a.hook.model_dump(),
                "deroule": list(a.storytelling),
                "style_visuel": a.visual_style,
            }
            for a in data.analyses
        ],
    }, ensure_ascii=False, indent=2)
    out = await claude_json(GENERATE_SYSTEM, user, ai_schema.validate_generate)
    admin().table("prompts").insert({"product_id": p.id, "data": {**out, "targetTool": data.tool}}).execute()
    return out
