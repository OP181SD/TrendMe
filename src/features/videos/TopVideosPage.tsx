import { useHydrated, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { BlurText } from "@/components/reactbits";
import { platformLabel } from "@/components/PlatformIcon";
import { EmptyState } from "@/components/PageStates";
import { Skeleton } from "@/components/ui/skeleton";
import { analyze, saveSearchForDemo } from "@/lib/api";
import { defaultFilters, matches, type Filters } from "@/lib/filters";
import { trendScore, viewsMomentum } from "@/lib/scoring";
import { activeProduct, MAX_INSPIRATIONS, toggleInspiration, useStore } from "@/lib/store";
import { FilterPanel } from "./components/FilterPanel";
import { PlatformTabs, type PlatformFilter } from "./components/PlatformTabs";
import { SkeletonGrid, VideoGrid } from "./components/VideoGrid";
import { VideosToolbar, type SortKey } from "./components/VideosToolbar";

const NONE: string[] = [];

export function TopVideosPage() {
  const s = useStore();
  const product = activeProduct(s);
  const productId = product?.id;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [filter, setFilter] = useState<PlatformFilter>("all");
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("trend");

  const all = productId ? s.videos[productId] : undefined;
  const picked = (productId && s.inspirations[productId]) || NONE;
  // Tendance des vues calculée sur toute la recherche, pas sur le filtre affiché.
  const momentum = useMemo(() => new Map((all ?? []).map((v) => [v.id, viewsMomentum(v, all ?? [])])), [all]);
  const list = useMemo(
    () => (all ?? []).filter((v) => (filter === "all" || v.platform === filter) && matches(v, filters))
      .sort((a, b) => sort === "trend" ? trendScore(b) - trendScore(a) : b.score - a.score),
    [all, filter, filters, sort],
  );

  const openVideo = useCallback((videoId: string) => navigate({ to: "/analyse/$videoId", params: { videoId } }), [navigate]);
  const toggle = useCallback((videoId: string) => {
    if (productId && !toggleInspiration(productId, videoId)) toast.error(`${MAX_INSPIRATIONS} inspirations maximum`);
  }, [productId]);

  const saveDemo = useCallback(async () => {
    if (!product || !all?.length) return;
    setSaving(true);
    // Analyse les vidéos pas encore analysées, puis garde tout en base.
    await Promise.allSettled(all.map((v) => analyze(v, product, s.demoMode)));
    try {
      const r = await saveSearchForDemo(product.description || product.name, all);
      toast.success("Enregistré pour la démo", { description: `${r.videos} vidéos et ${r.analyses} analyses gardées en base.` });
    } catch {
      toast.error("L'enregistrement a échoué.", { description: "Réessayez dans un instant." });
    }
    setSaving(false);
  }, [product, all, s.demoMode]);

  if (!hydrated) return <div className="mx-auto max-w-6xl px-6 py-12 md:px-10"><Skeleton className="h-12 w-2/3 rounded-full" /><SkeletonGrid /></div>;
  if (!product) {
    return <EmptyState title="Aucune recherche" text="Choisissez un dossier ou lancez une recherche." to="/produits" cta="Trouver des inspirations" />;
  }

  const hasVideos = !!all && all.length > 0;
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
      <p className="text-sm text-muted-foreground">Dossier · {product.name}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-b border-dashed pb-6">
        <BlurText text="Tendances du moment" className="text-5xl font-bold tracking-tight" />
        <PlatformTabs value={filter} onChange={setFilter} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 text-primary" /> {sort === "trend" ? "Récentes et qui performent d'abord." : "Classé par vues, engagement et vues ÷ abonnés."}
        </p>
        {hasVideos && <VideosToolbar sort={sort} onSort={setSort} pickedCount={picked.length} saving={saving} onSaveDemo={saveDemo} />}
      </div>

      {hasVideos && <FilterPanel value={filters} onChange={setFilters} shown={list.length} total={all.length} />}

      {!all ? <SkeletonGrid /> : (
        <VideoGrid videos={list} picked={picked} momentum={momentum} onOpen={openVideo} onToggle={toggle}
          emptyHint={filter === "all" ? "Assouplissez les filtres ou reformulez." : `Rien sur ${platformLabel[filter]}.`} />
      )}
    </div>
  );
}
