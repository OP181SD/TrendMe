import { useHydrated } from "@tanstack/react-router";
import { useMemo } from "react";
import { BlurText } from "@/components/reactbits";
import { BackLink, EmptyState, PendingAnalyses } from "@/components/PageStates";
import { useAnalyses } from "@/hooks/use-analyses";
import { computeInsights } from "@/lib/insights";
import { activeProduct, useStore } from "@/lib/store";
import { InsightCards } from "./components/InsightCards";
import { ShareChart } from "./components/ShareChart";

export function InsightsPage() {
  const s = useStore();
  const hydrated = useHydrated();
  const product = activeProduct(s);
  const productVideos = product ? s.videos[product.id] : undefined;
  const videos = useMemo(() => productVideos ?? [], [productVideos]);
  const { analyses, pending, failed } = useAnalyses(videos, product, s.demoMode);
  const r = useMemo(() => computeInsights(videos, analyses), [videos, analyses]);

  if (!hydrated) return null;
  if (!product || videos.length === 0)
    return (
      <EmptyState
        title="Aucune recherche pour l'instant"
        to="/produits"
        cta="Lancer une recherche"
      />
    );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
      <BackLink to="/top-videos" label="Inspirations" />
      <p className="text-sm text-muted-foreground">Dossier · {product.name}</p>
      <BlurText
        text="Insights de la recherche"
        className="mt-2 text-5xl font-bold tracking-tight"
      />
      <p className="mt-3 text-sm text-muted-foreground">
        « Meilleures vidéos » = la moitié du haut du classement (
        <span className="font-mono">{r.topCount}</span> sur{" "}
        <span className="font-mono">{videos.length}</span>).
      </p>
      <PendingAnalyses count={pending} className="mt-2 block text-sm" />
      {failed > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-mono">{failed}</span> analyse{failed > 1 ? "s" : ""} n'a pas abouti
          : statistiques calculées sans elle{failed > 1 ? "s" : ""}.
        </p>
      )}

      <InsightCards r={r} />
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <ShareChart title="Types de hook" data={r.hookTypes} />
        <ShareChart title="Formats" data={r.formats} />
        <ShareChart title="Plateformes" data={r.platforms} />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Classement basé sur les vues, l'engagement public et l'attraction (vues ÷ abonnés), pas sur
        les performances publicitaires.
      </p>
    </div>
  );
}
