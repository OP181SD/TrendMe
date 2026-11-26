import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Hosting target: set NITRO_PRESET (e.g. "vercel", "cloudflare-module", "netlify"); defaults to a Node server.
export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // src/server.ts wraps the bundled server entry (SSR error page).
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    ...(command === "build" ? [nitro()] : []),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom", "@tanstack/react-query"],
  },
  server: { port: 8080 },
}));
