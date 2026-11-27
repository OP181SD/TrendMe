> [!IMPORTANT]
> published git history — force pushing, or rebasing/amending/squashing commits
> user will likely lose their project history.
>
> the editor, so keep the branch in a working state.


Rules outside this block are the project's own. Change the pieces below in
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  own key and store it in Secrets.

## Project rules
- All Oriane API knowledge (URL, request body, response mapping) lives only in `src/lib/oriane.server.ts`; swap providers or formats there. Why: the provider format may change.
- Video search runs as a TanStack server function (`src/lib/search.functions.ts`), not a Supabase Edge Function. Why: this stack forbids new Edge Functions; keys stay server-side.
- Database tables are server-only (RLS on, no anon/authenticated policies); the app reads/writes them through server functions. Why: the app has no sign-in yet.
- Scoring is pure and tested in `src/lib/scoring.ts`. Why: ranking rule must stay verifiable.
- Claude calls go through the built-in AI gateway SDK, only in `src/lib/claude.server.ts`; AI server functions are in `src/lib/ai.functions.ts`. Why: no provider key needed, model swappable in one place.
- AI system prompts live as plain text in `src/prompts/*.system.txt` (imported with `?raw`). Why: editable without touching code.
- Demo mode: client `demoMode` flag is passed to `searchVideos`; demo reads `pinned` rows (saved via "Enregistrer pour la démo") before latest rows, and analyses prefer stored ones. Why: reliable jury demo without Oriane.
- Evil Charts files under `src/components/evilcharts/` are vendored with `@ts-nocheck` and need recharts v3. Why: third-party code not written for this strict tsconfig.
- Aggregated insights are pure and tested in `src/lib/insights.ts`. Why: stats must stay verifiable.
- Shooting script is part of the same generate JSON (`shootingScript`); text/PDF export (jsPDF, client-side) lives in `src/lib/script-export.ts`. Why: one AI call, no server file storage.
