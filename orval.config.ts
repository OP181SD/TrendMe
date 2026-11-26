import { defineConfig } from "orval";

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

        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
});
