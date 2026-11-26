import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/features/insights/InsightsPage";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights de la recherche — TrendMe" },
      { name: "description", content: "Ce que les meilleures vidéos de votre recherche ont en commun : types de hook, formats, plateformes et engagement." },
      { property: "og:title", content: "Insights de la recherche — TrendMe" },
      { property: "og:description", content: "Les tendances des meilleures vidéos de marques et concurrents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InsightsPage,
});
