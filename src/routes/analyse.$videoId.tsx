import { createFileRoute } from "@tanstack/react-router";
import { AnalysisPage } from "@/features/analysis/AnalysisPage";

export const Route = createFileRoute("/analyse/$videoId")({
  head: () => ({
    meta: [
      { title: "Analyse de la vidéo — TrendMe" },
      { name: "description", content: "Pourquoi cette vidéo marche : hook, déroulé, style et correspondance avec votre marque." },
      { property: "og:title", content: "Analyse de la vidéo — TrendMe" },
      { property: "og:description", content: "Analyse détaillée d'une vidéo de marque ou concurrente." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalysisPage,
});
