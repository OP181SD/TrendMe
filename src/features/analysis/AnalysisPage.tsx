import { Link, useHydrated, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, ExternalLink, Plus } from "lucide-react";
import { BackLink } from "@/components/PageStates";
import { ShinyText } from "@/components/reactbits";
import { Button } from "@/components/ui/button";
import { analyze, getVideo } from "@/lib/api";
import { activeProduct, MAX_INSPIRATIONS, toggleInspiration, useStore } from "@/lib/store";
import { viewsMomentum } from "@/lib/scoring";
import type { Analysis } from "@/lib/types";
import { AnalysisSections, BrandMatchCard, HookQuote } from "./components/AnalysisDetails";
import { CreatorHeader } from "./components/CreatorHeader";
import { VideoMetrics } from "./components/VideoMetrics";
import { VideoPlayer } from "./components/VideoPlayer";

export function AnalysisPage() {
  const { videoId } = useParams({ from: "/analyse/$videoId" });
  const s = useStore();
  const hydrated = useHydrated();
  const product = activeProduct(s);
  const [ai, setAi] = useState<{ id: string; a?: Analysis; error?: boolean } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const allVideos = useMemo(() => Object.values(s.videos).flat(), [s.videos]);
  const v = hydrated ? getVideo(videoId, allVideos) : undefined;
  const checked = !!(v && product && s.inspirations[product.id]?.includes(v.id));
  const pool = (product ? s.videos[product.id] : undefined) ?? allVideos;
  const mom = useMemo(() => (v ? viewsMomentum(v, pool) : null), [v, pool]);

  useEffect(() => {
    if (!v || !product) return;
    let alive = true;
    analyze(v, product, s.demoMode)
      .then((a) => {
        if (alive) setAi({ id: v.id, a });
      })
      .catch(() => {
        if (alive) setAi({ id: v.id, error: true });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- relance seulement si vidéo, dossier ou tentative change
  }, [v?.id, product?.id, attempt]);

  const retry = useCallback(() => {
    setAi(null);
    setAttempt((n) => n + 1);
  }, []);
  const addInspiration = useCallback(() => {
    if (!v) return;
    if (!product) {
      toast.error("Lancez d'abord une recherche");
      return;
    }
    if (!toggleInspiration(product.id, v.id))
      toast.error(`${MAX_INSPIRATIONS} inspirations maximum`);
    else toast.success(checked ? "Retirée des inspirations" : "Ajoutée aux inspirations");
  }, [v, product, checked]);

  if (!hydrated) return null;
  const a = v && ai?.id === v.id ? ai.a : undefined;
  if (v && product && !a) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-12 text-center">
        {ai?.id === v.id && ai.error ? (
          <>
            <p className="text-lg font-medium">L'analyse de cette vidéo n'a pas abouti.</p>
            <Button className="rounded-full" onClick={retry}>
              Réessayer
            </Button>
          </>
        ) : (
          <ShinyText text="Analyse de la vidéo en cours…" className="text-2xl font-bold" />
        )}
      </div>
    );
  }
  if (!v || !a || !mom)
    return (
      <div className="p-12 text-center text-muted-foreground">
        Vidéo introuvable.{" "}
        <Link to="/top-videos" className="text-primary">
          Retour aux vidéos
        </Link>
      </div>
    );
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="px-6 py-10 md:px-10">
        <BackLink to="/top-videos" label="Inspirations" />
        <CreatorHeader v={v} format={a.format} />
        <HookQuote hook={a.hook} />
        <VideoMetrics v={v} momentum={mom} />
        <AnalysisSections a={a} />
        <BrandMatchCard match={a.brandMatch} />
        <div className="mt-8 flex flex-wrap gap-3 border-t border-dashed pt-6">
          <Button variant="secondary" size="lg" className="rounded-full" onClick={addInspiration}>
            {checked ? <Check /> : <Plus />}{" "}
            {checked ? "Dans les inspirations" : "Ajouter aux inspirations"}
          </Button>
          <Button asChild size="lg" className="rounded-full">
            <a href={v.url} target="_blank" rel="noreferrer">
              Voir la vidéo <ExternalLink />
            </a>
          </Button>
        </div>
      </div>
      <VideoPlayer key={v.id} v={v} />
    </div>
  );
}
