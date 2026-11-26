import { FadeContent } from "@/components/reactbits";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCachedAnalysis } from "@/lib/api";
import type { MomentumInfo } from "@/lib/scoring";
import { MAX_INSPIRATIONS } from "@/lib/store";
import type { Video } from "@/lib/types";
import { VideoCard } from "./VideoCard";

const GRID = "mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";

interface Props {
  videos: Video[];
  picked: string[];
  momentum: Map<string, MomentumInfo>;
  emptyHint: string;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
}

export function VideoGrid({ videos, picked, momentum, emptyHint, onOpen, onToggle }: Props) {
  if (videos.length === 0) {
    return (
      <div className="mt-10 rounded-[2rem] border border-dashed p-10 text-center">
        <p className="text-lg font-medium">Aucune vidéo trouvée</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }
  const full = picked.length >= MAX_INSPIRATIONS;
  return (
    <TooltipProvider delayDuration={150}>
      <div className={GRID}>
        {videos.map((v, i) => {
          const checked = picked.includes(v.id);
          return (
            <FadeContent key={v.id} delay={i * 0.06}>
              <VideoCard
                v={v}
                format={getCachedAnalysis(v.id)?.format}
                momentum={momentum.get(v.id)}
                onOpen={onOpen}
                onToggle={onToggle}
                checked={checked}
                toggleDisabled={!checked && full}
              />
            </FadeContent>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

export function SkeletonGrid() {
  return (
    <div className={GRID} aria-label="Chargement des vidéos">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[9/16] rounded-[1.75rem]" />
      ))}
    </div>
  );
}
