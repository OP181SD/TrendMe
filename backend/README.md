# Backend Python — Glow Trend Scout

FastAPI. Réécriture from-scratch du backend (server functions TanStack) en Python.
Mêmes règles que `AGENTS.md` : savoir Oriane isolé, Claude isolé, scoring/insights purs et testés.

## Structure

| Fichier | Rôle | Équivalent TS |
|---------|------|---------------|
| `app/main.py` | routes HTTP | `*.functions.ts` |
| `app/oriane.py` | **seul** fichier qui connaît l'API Oriane | `oriane.server.ts` |
| `app/claude_client.py` | **seul** fichier qui appelle Claude | `claude.server.ts` |
| `app/scoring.py` | scoring pur | `scoring.ts` |
| `app/insights.py` | insights purs | `insights.ts` |
| `app/ai_schema.py` | validation JSON Claude | schémas zod de `ai.functions.ts` |
| `app/db.py` | client Supabase service-role | `client.server.ts` |
| `app/prompts/` | prompts système | `src/prompts/` |

## Endpoints (1:1 avec les server functions)

| Méthode | Route | Remplace |
|---------|-------|----------|
| POST | `/search/videos` | `searchVideos` |
| POST | `/analyses/stored` | `getStoredAnalysis` |
| POST | `/demo/save` | `saveForDemo` |
| POST | `/ai/analyze` | `analyzeVideo` |
| POST | `/ai/generate` | `generateAdPrompt` |
| GET | `/health` | — |

## Lancer

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # remplir les clés
uvicorn app.main:app --reload --port 8000
```

Docs auto : http://localhost:8000/docs

## Tests

```bash
cd backend && python tests/test_pure.py     # ou: pytest
```

## À faire côté front (non inclus)

Le front appelle encore les server functions TanStack. Pour basculer dessus :
remplacer les appels `searchVideos(...)` etc. par un `fetch("$API/search/videos", ...)`.
Les tables Supabase (`searches`, `videos`, `analyses`, `prompts`) sont partagées — aucune migration.
