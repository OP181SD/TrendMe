import { createFileRoute } from "@tanstack/react-router";
import { GenerationsPage } from "@/features/generation/GenerationsPage";

export const Route = createFileRoute("/generations")({
  head: () => ({
    meta: [
      { title: "Générations — TrendMe" },
      { name: "description", content: "Retrouvez et copiez vos prompts vidéo IA pour Veo, Sora, Kling et Runway." },
      { property: "og:title", content: "Générations — TrendMe" },
      { property: "og:description", content: "Vos prompts publicitaires prêts à copier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GenerationsPage,
});
