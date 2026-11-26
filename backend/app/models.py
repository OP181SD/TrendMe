"""Pydantic types mirroring src/lib/types.ts."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Platform = Literal["tiktok", "instagram", "youtube"]
TargetTool = Literal["Veo", "Sora", "Kling", "Runway"]


class Creator(BaseModel):
    handle: str
    name: str
    followers: int


class Video(BaseModel):
    id: str
    platform: Platform
    url: str
    thumbnailUrl: str
    creator: Creator
    publishedAt: str
    durationSeconds: int
    views: int
    likes: int
    comments: int
    shares: int
    engagementRate: float
    caption: str
    transcript: str
    onScreenText: list[str]
    hashtags: list[str]
    score: int = 0
    scoreReason: str = ""


class Hook(BaseModel):
    description: str
    seconds: float
    type: Literal["question", "choc", "promesse", "visuel"]


class BrandMatch(BaseModel):
    score: float
    reason: str


class Analysis(BaseModel):
    concept: str
    format: Literal["UGC", "tutoriel", "avant/après", "témoignage", "unboxing", "sketch", "autre"]
    hook: Hook
    message: str
    storytelling: tuple[str, str, str]
    visual_style: str
    cta: str
    why_it_works: tuple[str, str, str]
    brandMatch: BrandMatch


class Brand(BaseModel):
    name: str
    tone: str
    colors: list[str]
    target: str


class Style(BaseModel):
    format: str
    durationSeconds: int
    platform: Platform | None = None


class Product(BaseModel):
    id: str
    name: str
    description: str
    imageUrl: str
    createdAt: str | None = None
    brand: Brand
    style: Style


class SearchImage(BaseModel):
    mediaType: Literal["image/jpeg", "image/png", "image/webp"]
    base64: str = Field(min_length=10, max_length=14_000_000)


class SearchInput(BaseModel):
    query: str = Field(min_length=2, max_length=500)
    platform: Platform | None = None
    limit: int = Field(default=5, ge=1, le=10)
    demo: bool | None = None
    image: SearchImage | None = None


class SearchResult(BaseModel):
    videos: list[Video]
    source: Literal["oriane", "demo"]
    error: str | None = None
    imageUsed: bool | None = None
    imageUnsupported: bool | None = None


class StoredAnalysisInput(BaseModel):
    videoId: str = Field(min_length=1, max_length=200)


class DemoAnalysis(BaseModel):
    videoId: str
    analysis: Analysis


class SaveForDemoInput(BaseModel):
    query: str
    videos: list[Video]
    analyses: list[DemoAnalysis] = []


class PromptScene(BaseModel):
    title: str
    start: float
    end: float
    shot: str
    visual: str
    voiceOver: str
    onScreenText: str


class ScriptHook(BaseModel):
    texte_oral: str
    texte_ecran: str
    action: str
    seconds: float


class ScriptScene(BaseModel):
    numero: float
    duree_s: float
    plan: str
    action: str
    texte_oral: str
    texte_ecran: str


class ScriptCta(BaseModel):
    texte_oral: str
    texte_ecran: str


class ShootingScript(BaseModel):
    hook: ScriptHook
    scenes: list[ScriptScene]
    cta: ScriptCta
    materiel: list[str]
    conseils: list[str]


class GeneratedPrompt(BaseModel):
    prompt: str
    kept: list[str]
    original: list[str]
    scenes: list[PromptScene] = []
    totalSeconds: float | None = None
    music: str = ""
    cta: str = ""
    shootingScript: ShootingScript | None = None
    targetTool: TargetTool


class SaveResult(BaseModel):
    videos: int
    analyses: int


class AnalyzeInput(BaseModel):
    video: Video
    product: Product


class GenerateInput(BaseModel):
    product: Product
    analyses: list[Analysis]
    tool: TargetTool
