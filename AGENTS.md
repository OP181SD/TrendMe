## Project rules

### Backend (Python / FastAPI, `backend/`)
- All server logic lives in the FastAPI backend (`backend/app/`), not in TanStack server functions. The frontend has no server functions anymore. Why: backend and frontend are decoupled; keys stay server-side in Python.
- All Oriane API knowledge (URL, request body, response mapping) lives only in `backend/app/oriane.py`; swap providers or formats there. Why: the provider format may change.
- AI/LLM calls go through the Anthropic SDK (key `ANTHROPIC_API_KEY`, server-side only), only in `backend/app/claude_client.py`; model id is set there. Why: model swappable in one place, key never reaches the browser.
- AI system prompts live as plain text in `backend/app/prompts/*.system.txt` (read at startup). Why: editable without touching code.
- Scoring is pure and tested in `backend/app/scoring.py`; aggregated insights are pure and tested in `backend/app/insights.py` (`backend/tests/test_pure.py`). Why: ranking and stats must stay verifiable.
- Database tables are server-only (RLS on, no anon/authenticated policies); the backend reads/writes them with the Supabase service-role client (`backend/app/db.py`). Why: the app has no sign-in yet.
- Request/response types are Pydantic models in `backend/app/models.py`; LLM-output validation (defaults for malformed JSON) is in `backend/app/ai_schema.py`. Why: one typed contract, resilient to model drift.
- Endpoints map 1:1 to the old server functions: `/search/videos`, `/analyses/stored`, `/demo/save`, `/ai/analyze`, `/ai/generate`. Every route sets `operation_id` and `response_model`. Why: stable, typed contract for the generated client.

### Frontend ↔ backend bridge
- The frontend talks to the backend only through the Orval-generated client in `src/lib/api/` (typed TanStack Query hooks + plain functions), wrapped by the façade `src/lib/api.ts`. Components import the façade, never the generated files directly. Why: one integration seam; the OpenAPI spec is the single source of truth for types.
- Never hand-edit `src/lib/api/` (generated). After a backend endpoint change: `bun run dump:api` (writes `backend/openapi.json`) then `bun run gen:api`. Why: the client is derived, not authored.
- The Orval mutator `src/lib/apiFetcher.ts` owns the base URL (`VITE_API_URL`), throws on HTTP error, and returns the parsed 200 body. Why: one place for transport concerns.
- `src/lib/scoring.ts` and `src/lib/insights.ts` are pure TS copies kept for client-side display only (momentum badges, insights view); the backend owns the authoritative ranking. Keep them in sync with the Python versions. Why: avoid a round-trip for display math.

### Shared conventions
- Demo mode: client `demoMode` flag is sent on search; demo reads `pinned` rows (saved via "Enregistrer pour la démo") before latest rows, and analyses prefer stored ones. Why: reliable jury demo without Oriane.
- Evil Charts files under `src/components/evilcharts/` are vendored with `@ts-nocheck` and need recharts v3. Why: third-party code not written for this strict tsconfig.
- Shooting script is part of the same generate JSON (`shootingScript`); text/PDF export (jsPDF, client-side) lives in `src/lib/script-export.ts`. Why: one AI call, no server file storage.
- Architecture: `src/routes/*` only declare the route (path, head) and import a page from `src/features/<feature>/<Name>Page.tsx`. Page = state, hooks, handlers (`useMemo`/`useCallback`); `features/<feature>/components/` = presentational pieces used by that feature only. Shared UI lives in `src/components/` (`layout/` for the app shell), shared hooks in `src/hooks/`. Why: routes stay thin, each feature is self-contained.
