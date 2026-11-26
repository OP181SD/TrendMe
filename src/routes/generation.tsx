import { createFileRoute } from "@tanstack/react-router";
import { GenerationPage } from "@/features/generation/GenerationPage";

export const Route = createFileRoute("/generation")({
  head: () => ({
    meta: [
      { title: "Génération — TrendMe" },
      {
        name: "description",
        content:
          "Récapitulez recherche, marque et inspirations, choisissez Veo, Sora, Kling ou Runway et générez votre prompt.",
      },
      { property: "og:title", content: "Génération — TrendMe" },
      {
        property: "og:description",
        content: "Générez votre prompt vidéo IA à partir de vos inspirations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GenerationPage,
});
