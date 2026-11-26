import { createFileRoute } from "@tanstack/react-router";
import { PromptPage } from "@/features/generation/PromptPage";

export const Route = createFileRoute("/prompt/$id")({
  head: () => ({
    meta: [
      { title: "Prompt final — TrendMe" },
      { name: "description", content: "Votre prompt vidéo IA structuré : scènes, plans, durée, voix off, texte à l'écran, musique et CTA." },
      { property: "og:title", content: "Prompt final — TrendMe" },
      { property: "og:description", content: "Un prompt vidéo prêt à copier." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PromptPage,
});
