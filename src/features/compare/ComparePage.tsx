import { useHydrated } from "@tanstack/react-router";
import { BlurText } from "@/components/reactbits";
import { BackLink, EmptyState, PendingAnalyses } from "@/components/PageStates";
import { useAnalyses } from "@/hooks/use-analyses";
import { useInspirationVideos } from "@/hooks/use-inspiration-videos";
import { activeProduct, useStore } from "@/lib/store";
import { CompareTable } from "./components/CompareTable";

export function ComparePage() {
  const s = useStore();
  const hydrated = useHydrated();
  const product = activeProduct(s);
  const videos = useInspirationVideos(product);
  const { analyses, pending } = useAnalyses(videos, product, s.demoMode);

  if (!hydrated) return null;
  if (!product || videos.length < 2) {
    return <EmptyState title="Choisissez 2 ou 3 vidéos" text="Cochez « Ajouter aux inspirations » sur 2 ou 3 vidéos pour les comparer." to="/top-videos" cta="Voir les vidéos" />;
  }
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
      <BackLink to="/top-videos" label="Inspirations" />
      <BlurText text="Comparaison côte à côte" className="text-5xl font-bold tracking-tight" />
      <PendingAnalyses count={pending} className="mt-3 block text-sm" />
      <CompareTable videos={videos} analyses={analyses} />
    </div>
  );
}
