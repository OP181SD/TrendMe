import { defineConfig } from "orval";

// Génère un client TanStack Query typé depuis le spec OpenAPI du backend FastAPI.
// Régénérer : `bun run gen:api` (après `bun run dump:api` si le backend a changé).
export default defineConfig({
  trendme: {
    input: "./backend/openapi.json",
    output: {
      target: "./src/lib/api/endpoints.ts",
      schemas: "./src/lib/api/model",
      client: "react-query",
      mode: "single",
      prettier: true,
      clean: true,
      override: {
        mutator: { path: "./src/lib/apiFetcher.ts", name: "customFetch" },
        query: { useQuery: true, useMutation: true },
        // Le mutator jette sur erreur HTTP → les fonctions renvoient directement les données du 200.
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
});
