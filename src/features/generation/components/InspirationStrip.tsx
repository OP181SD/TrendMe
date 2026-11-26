import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { FadeContent } from "@/components/reactbits";
import { PlatformIcon } from "@/components/PlatformIcon";
import { hookText } from "@/lib/format";
import { MAX_INSPIRATIONS } from "@/lib/store";
import type { Video } from "@/lib/types";

export function InspirationStrip({ videos, onRemove }: { videos: Video[]; onRemove: (id: string) => void }) {
  return (
    <div className="mt-8">
      <div className="flex items-end justify-between border-b border-dashed pb-3">
        <h2 className="text-2xl font-bold">Inspirations</h2>
        <span className="font-mono text-sm text-muted-foreground">{videos.length}/{MAX_INSPIRATIONS}</span>
      </div>
      {videos.length === 0 ? (
        <p className="mt-5 text-muted-foreground">Aucune inspiration choisie. <Link to="/top-videos" className="text-primary">Cochez 1 à 3 vidéos</Link> dans les inspirations.</p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {videos.map((v, i) => (
            <FadeContent key={v.id} delay={i * 0.06} className="relative flex aspect-[9/16] max-h-80 flex-col justify-end overflow-hidden rounded-[1.75rem] border border-dashed bg-ink p-4 text-ink-foreground">
              {v.thumbnailUrl ? (
                <img src={v.thumbnailUrl} alt={`Miniature de @${v.creator.handle}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-accent/60 via-card to-ink" />
              )}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <button onClick={() => onRemove(v.id)} aria-label="Retirer" className="absolute right-3 top-3 z-10 rounded-full bg-ink/80 p-1.5"><X className="h-3.5 w-3.5" /></button>
              <p className="relative font-bold">« {hookText(v)} »</p>
              <p className="relative mt-2 inline-flex items-center gap-1.5 text-sm text-ink-foreground/80"><PlatformIcon platform={v.platform} className="h-3.5 w-3.5" /> @{v.creator.handle}</p>
            </FadeContent>
          ))}
        </div>
      )}
    </div>
  );
}
