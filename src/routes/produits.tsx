import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/features/search/SearchPage";

export const Route = createFileRoute("/produits")({
  head: () => ({
    meta: [
      { title: "Trouver des inspirations — TrendMe" },
      {
        name: "description",
        content: "Tapez ce que vous voulez promouvoir, on trouve les vidéos qui cartonnent.",
      },
      { property: "og:title", content: "Trouver des inspirations — TrendMe" },
      { property: "og:description", content: "Une recherche, des vidéos qui cartonnent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});
