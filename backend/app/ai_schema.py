"""Validation/normalisation des JSON renvoyés par Claude.
Port des schémas zod (analyze/generate) de src/lib/ai.functions.ts, avec leurs valeurs par défaut (.catch).
"""
from __future__ import annotations

from typing import Any

_FORMATS = {"UGC", "tutoriel", "avant/après", "témoignage", "unboxing", "sketch", "autre"}
_HOOK_TYPES = {"question", "choc", "promesse", "visuel"}
_SHOTS = {"face caméra", "gros plan produit", "mains", "avant/après", "plan large"}


def _num(v: Any, default: float = 0) -> float:
    try:
        return float(v)
    except (TypeError, ValueError):
        return default


def _str(v: Any, default: str = "") -> str:
    return v if isinstance(v, str) else default


def _triple(v: Any) -> list[str]:
    arr = v if isinstance(v, list) else []
    arr = [_str(x) for x in arr][:3]
    while len(arr) < 3:
        arr.append("")
    return arr


def validate_analysis(v: Any) -> dict:
    if not isinstance(v, dict):
        raise ValueError("analysis attendue en objet")
    hook = v.get("hook") or {}
    bm = v.get("brandMatch") or {}
    bm_score = _num(bm.get("score"), 0)
    bm_score = max(0.0, min(100.0, bm_score))
    return {
        "concept": _require_str(v.get("concept"), "concept"),
        "format": v["format"] if v.get("format") in _FORMATS else "autre",
        "hook": {
            "description": _require_str(hook.get("description"), "hook.description"),
            "seconds": _num(hook.get("seconds"), 0),
            "type": hook["type"] if hook.get("type") in _HOOK_TYPES else "visuel",
        },
        "message": _require_str(v.get("message"), "message"),
        "storytelling": _require_triple(v.get("storytelling"), "storytelling"),
        "visual_style": _require_str(v.get("visual_style"), "visual_style"),
        "cta": _require_str(v.get("cta"), "cta"),
        "why_it_works": _require_triple(v.get("why_it_works"), "why_it_works"),
        "brandMatch": {"score": bm_score, "reason": _require_str(bm.get("reason"), "brandMatch.reason")},
    }


def _require_str(v: Any, field: str) -> str:
    if not isinstance(v, str):
        raise ValueError(f"{field} attendu en chaîne")
    return v


def _require_triple(v: Any, field: str) -> list[str]:
    if not isinstance(v, list) or len(v) != 3 or not all(isinstance(x, str) for x in v):
        raise ValueError(f"{field} attendu en triplet de chaînes")
    return list(v)


def _validate_script(v: Any) -> dict | None:
    if not isinstance(v, dict):
        return None
    hook = v.get("hook") or {}
    cta = v.get("cta") or {}
    scenes = []
    for s in (v.get("scenes") or []):
        s = s if isinstance(s, dict) else {}
        scenes.append({
            "numero": _num(s.get("numero"), 0),
            "duree_s": _num(s.get("duree_s"), 0),
            "plan": s["plan"] if s.get("plan") in _SHOTS else "face caméra",
            "action": _str(s.get("action")),
            "texte_oral": _str(s.get("texte_oral")),
            "texte_ecran": _str(s.get("texte_ecran")),
        })
    return {
        "hook": {
            "texte_oral": _str(hook.get("texte_oral")),
            "texte_ecran": _str(hook.get("texte_ecran")),
            "action": _str(hook.get("action")),
            "seconds": _num(hook.get("seconds"), 3),
        },
        "scenes": scenes,
        "cta": {"texte_oral": _str(cta.get("texte_oral")), "texte_ecran": _str(cta.get("texte_ecran"))},
        "materiel": [x for x in (v.get("materiel") or []) if isinstance(x, str)],
        "conseils": [x for x in (v.get("conseils") or []) if isinstance(x, str)],
    }


def validate_generate(v: Any) -> dict:
    if not isinstance(v, dict):
        raise ValueError("generate attendu en objet")
    if not isinstance(v.get("prompt"), str):
        raise ValueError("prompt attendu en chaîne")
    if not isinstance(v.get("kept"), list) or not isinstance(v.get("original"), list):
        raise ValueError("kept et original attendus en listes")
    scenes = []
    for s in (v.get("scenes") or []):
        s = s if isinstance(s, dict) else {}
        scenes.append({
            "title": _str(s.get("title")),
            "start": _num(s.get("start"), 0),
            "end": _num(s.get("end"), 0),
            "shot": _str(s.get("shot")),
            "visual": _str(s.get("visual")),
            "voiceOver": _str(s.get("voiceOver")),
            "onScreenText": _str(s.get("onScreenText")),
        })
    out = {
        "prompt": v["prompt"],
        "kept": [_str(x) for x in v["kept"]],
        "original": [_str(x) for x in v["original"]],
        "scenes": scenes,
        "music": _str(v.get("music")),
        "cta": _str(v.get("cta")),
    }
    if v.get("totalSeconds") is not None:
        out["totalSeconds"] = _num(v.get("totalSeconds"), 0)
    script = _validate_script(v.get("shootingScript"))
    if script is not None:
        out["shootingScript"] = script
    return out
