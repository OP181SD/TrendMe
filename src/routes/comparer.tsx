import { createFileRoute } from "@tanstack/react-router";
import { ComparePage } from "@/features/compare/ComparePage";

export const Route = createFileRoute("/comparer")({
  head: () => ({
    meta: [
      { title: "Comparer les vidéos — TrendMe" },
      { name: "description", content: "Comparez côte à côte 2 ou 3 vidéos : hook, format, CTA, score et correspondance avec votre marque." },
      { property: "og:title", content: "Comparer les vidéos — TrendMe" },
      { property: "og:description", content: "Hook, format, CTA et score de 2 ou 3 vidéos, côte à côte." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ComparePage,
});
