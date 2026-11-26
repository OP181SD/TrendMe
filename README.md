# TrendMe

Recherche de vidéos tendances (Oriane), scoring, analyse et génération de scripts publicitaires. Frontend React/TanStack Start + backend Python/FastAPI (voir `backend/`). Commandes : `make help`.

## Développement

```sh
bun install
bun run dev      # http://localhost:8080
bun run test
bun run build    # NITRO_PRESET=vercel|cloudflare-module|netlify ; serveur Node par défaut
```

Variables `.env` (côté serveur, jamais commitées) :

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- `ANTHROPIC_API_KEY`
- `ORIANE_API_URL`, `ORIANE_API_KEY`
- `DATABASE_URL` (migrations drizzle)
