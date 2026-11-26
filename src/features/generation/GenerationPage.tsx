import { Link, useHydrated, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { BlurText } from "@/components/reactbits";
import { useInspirationVideos } from "@/hooks/use-inspiration-videos";
import { generate } from "@/lib/api";
import { activeProduct, setState, toggleInspiration, useStore } from "@/lib/store";
import type { TargetTool } from "@/lib/types";
import { GenerateBar, ModePicker } from "./components/GenerateControls";
import { InspirationStrip } from "./components/InspirationStrip";
import { RecapCards } from "./components/RecapCards";
import type { GenerationMode } from "./constants";

export function GenerationPage() {
  const s = useStore();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const product = activeProduct(s);
  const [tool, setTool] = useState<TargetTool>("Veo");
  const [mode, setMode] = useState<GenerationMode>("humain");
  const [loading, setLoading] = useState(false);
  const videos = useInspirationVideos(product);

  const run = useCallback(async () => {
    if (!product) return;
    setLoading(true);
    let result;
    try {
      result = await generate(product, videos, tool, s.demoMode);
    } catch {
      setLoading(false);
      toast.error("La génération a échoué.", { description: "Réessayez dans un instant." });
      return;
    }
    const id = crypto.randomUUID();
    setState((st) => ({
      ...st,
      generations: [
        { id, productId: product.id, videos, result, mode, createdAt: new Date().toISOString() },
        ...st.generations,
      ],
    }));
    setLoading(false);
    navigate({ to: "/prompt/$id", params: { id } });
  }, [product, videos, tool, mode, s.demoMode, navigate]);

  const removeInspiration = useCallback(
    (videoId: string) => {
      if (product) toggleInspiration(product.id, videoId);
    },
    [product],
  );

  if (!hydrated) return null;
  if (!product) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Aucune recherche.{" "}
        <Link to="/produits" className="text-primary">
          Trouver des inspirations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <BlurText text="Génération" className="text-5xl font-bold tracking-tight" />
      <p className="mt-3 text-muted-foreground">
        Vérifiez le récapitulatif, choisissez l'outil vidéo, puis générez.
      </p>
      <RecapCards product={product} />
      <InspirationStrip videos={videos} onRemove={removeInspiration} />
      <ModePicker value={mode} onChange={setMode} />
      <GenerateBar
        mode={mode}
        tool={tool}
        onTool={setTool}
        loading={loading}
        disabled={videos.length === 0}
        onRun={run}
      />
    </div>
  );
}
