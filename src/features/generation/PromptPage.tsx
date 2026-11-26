import { Link, useHydrated, useParams } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { BackLink } from "@/components/PageStates";
import { BlurText } from "@/components/reactbits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopy } from "@/hooks/use-copy";
import { generate } from "@/lib/api";
import { setState, useStore } from "@/lib/store";
import { KeptOriginal } from "./components/KeptOriginal";
import { PromptCard, RegenLoading } from "./components/PromptCard";
import { SceneTimeline } from "./components/SceneTimeline";
import { ShootingScriptView } from "./components/ShootingScriptView";

export function PromptPage() {
  const { id } = useParams({ from: "/prompt/$id" });
  const s = useStore();
  const hydrated = useHydrated();
  const { copied, copy } = useCopy("Prompt copié");
  const [regen, setRegen] = useState(false);
  const g = s.generations.find((x) => x.id === id);
  const product = g && s.products.find((p) => p.id === g.productId);

  const regenerate = useCallback(async () => {
    if (!g || !product) return;
    setRegen(true);
    let result;
    try {
      result = await generate(product, g.videos, g.result.targetTool, s.demoMode);
    } catch {
      setRegen(false);
      toast.error("La régénération a échoué.", { description: "Réessayez dans un instant." });
      return;
    }
    setState((st) => ({
      ...st,
      generations: st.generations.map((x) =>
        x.id === g.id ? { ...x, result, createdAt: new Date().toISOString() } : x,
      ),
    }));
    setRegen(false);
    toast.success("Nouvelle version générée");
  }, [g, product, s.demoMode]);

  if (!hydrated) return null;
  if (!g || !product)
    return (
      <div className="p-12 text-center text-muted-foreground">
        Prompt introuvable.{" "}
        <Link to="/generations" className="text-primary">
          Voir les générations
        </Link>
      </div>
    );
  const r = g.result;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <BackLink to="/generation" label="Génération" className="mb-4" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <BlurText
          text={
            g.mode === "humain" ? "Votre script de tournage" : `Votre prompt pour ${r.targetTool}`
          }
          className="text-5xl font-bold tracking-tight"
        />
        <p className="font-mono text-sm text-muted-foreground">
          {r.scenes.length} scènes · {r.totalSeconds} s
        </p>
      </div>
      <SceneTimeline scenes={r.scenes} />

      <Tabs defaultValue={g.mode === "humain" ? "script" : "prompt"} className="mt-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="prompt" className="rounded-full">
            Prompt IA
          </TabsTrigger>
          <TabsTrigger value="script" className="rounded-full">
            Script de tournage
          </TabsTrigger>
        </TabsList>
        <TabsContent value="script" className="mt-4">
          {regen ? (
            <RegenLoading />
          ) : (
            <ShootingScriptView
              script={r.shootingScript}
              title={product.name}
              onRegenerate={regenerate}
            />
          )}
        </TabsContent>
        <TabsContent value="prompt">
          <PromptCard
            prompt={r.prompt}
            regen={regen}
            copied={copied}
            onCopy={() => copy(r.prompt)}
            onRegenerate={regenerate}
          />
        </TabsContent>
      </Tabs>

      <KeptOriginal kept={r.kept} original={r.original} />
    </div>
  );
}
