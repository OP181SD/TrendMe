import { createFileRoute } from "@tanstack/react-router";
import { TopVideosPage } from "@/features/videos/TopVideosPage";

export const Route = createFileRoute("/top-videos")({
  head: () => ({
    meta: [
      { title: "Vidéos qui cartonnent — TrendMe" },
      {
        name: "description",
        content:
          "Les vidéos TikTok, Instagram et YouTube de marques et concurrents qui performent, analysées pour vous.",
      },
      { property: "og:title", content: "Vidéos qui cartonnent — TrendMe" },
      {
        property: "og:description",
        content: "Les vidéos de marques et concurrents qui marchent, et pourquoi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TopVideosPage,
});
