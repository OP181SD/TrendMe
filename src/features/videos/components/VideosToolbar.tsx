import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowRight, BarChart3, Columns3, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_INSPIRATIONS } from "@/lib/store";
import { cn } from "@/lib/utils";

export type SortKey = "trend" | "score";

interface Props {
  sort: SortKey;
  onSort: (k: SortKey) => void;
  pickedCount: number;
  saving: boolean;
  onSaveDemo: () => void;
}

/** Tri, liens Insights/Comparer, enregistrement démo et bouton Générer. */
export function VideosToolbar({ sort, onSort, pickedCount, saving, onSaveDemo }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-full border border-dashed p-0.5 text-sm">
        {(["trend", "score"] as const).map((k) => (
          <button key={k} onClick={() => onSort(k)} className={cn("rounded-full px-3 py-1", sort === k ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{k === "trend" ? "Tendance" : "Score"}</button>
        ))}
      </div>
      <Button asChild size="sm" variant="outline" className="rounded-full border-dashed"><Link to="/insights"><BarChart3 /> Insights</Link></Button>
      {pickedCount < 2 ? (
        <Button size="sm" variant="outline" className="rounded-full border-dashed" onClick={() => toast("Cochez au moins 2 vidéos pour comparer.")}>
          <Columns3 /> Comparer <span className="font-mono text-xs text-muted-foreground">{pickedCount}/2</span>
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline" className="rounded-full border-dashed">
          <Link to="/comparer"><Columns3 /> Comparer</Link>
        </Button>
      )}
      <Button size="sm" variant="outline" className="rounded-full border-dashed" disabled={saving} onClick={onSaveDemo}>
        {saving ? <Loader2 className="animate-spin" /> : <Save />} Démo
      </Button>
      <p className="text-sm text-muted-foreground">Inspirations <span className="font-mono text-foreground">{pickedCount}/{MAX_INSPIRATIONS}</span></p>
      <Button asChild size="sm" className="rounded-full" disabled={pickedCount === 0}>
        <Link to="/generation" disabled={pickedCount === 0}>Générer <ArrowRight /></Link>
      </Button>
    </div>
  );
}
