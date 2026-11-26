import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TrendMe" },
      { name: "description", content: "Suivez vos recherches, les vidéos concurrentes analysées et vos prompts vidéo IA générés." },
      { property: "og:title", content: "Dashboard — TrendMe" },
      { property: "og:description", content: "Vos pubs vidéo inspirées des meilleures, en un coup d'œil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});
