import { useState } from "react";
import { Play, X } from "lucide-react";
import { PlatformIcon, platformLabel } from "@/components/PlatformIcon";
import { hookText } from "@/lib/format";
import type { Video } from "@/lib/types";
import { embedUrl } from "../embed-url";

/** Colonne droite : lecteur intégré, miniature cliquable, ou lien externe si pas d'intégration possible. Monter avec key={v.id}. */
export function VideoPlayer({ v }: { v: Video }) {
  const [playing, setPlaying] = useState(false);
  const embed = embedUrl(v);
  return (
    <aside className="relative overflow-hidden border-l border-dashed lg:sticky lg:top-0 lg:h-screen">
      <div className="absolute inset-0 scale-125 bg-gradient-to-b from-primary/40 via-accent to-ink blur-3xl" aria-hidden />
      <div className="relative flex h-full items-center justify-center p-8">
        {embed && playing ? (
          <div className="relative w-full max-w-[380px]">
            <iframe src={embed} title={`Vidéo de @${v.creator.handle}`} className="aspect-[9/16] max-h-[calc(100vh-4rem)] w-full overflow-hidden rounded-[1.75rem] border-0 bg-ink shadow-2xl ring-1 ring-border" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            <button onClick={() => setPlaying(false)} aria-label="Fermer le lecteur" className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border"><X className="h-4 w-4" /></button>
          </div>
        ) : embed ? (
          <button onClick={() => setPlaying(true)} aria-label="Lire la vidéo" className="group relative aspect-[9/16] max-h-[calc(100vh-4rem)] w-full max-w-[380px] overflow-hidden rounded-[1.75rem] bg-ink shadow-2xl ring-1 ring-border">
            {v.thumbnailUrl && <img src={v.thumbnailUrl} alt={`Miniature de @${v.creator.handle}`} className="absolute inset-0 h-full w-full object-cover" />}
            <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform group-hover:scale-110"><Play className="ml-1 h-7 w-7 fill-current" /></span>
            <span className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium"><PlatformIcon platform={v.platform} className="h-3.5 w-3.5" /> Lire la vidéo</span>
          </button>
        ) : (
          <a href={v.url} target="_blank" rel="noreferrer" className="group relative flex aspect-[9/16] w-full max-w-[340px] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed bg-ink/70 p-6 text-center">
            {v.thumbnailUrl && <img src={v.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />}
            <p className="relative text-2xl font-bold">« {hookText(v)} »</p>
            <span className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground group-hover:opacity-90">
              <PlatformIcon platform={v.platform} /> Ouvrir sur {platformLabel[v.platform]}
            </span>
            <span className="relative mt-3 text-xs text-muted-foreground">Lecture intégrée indisponible pour cette vidéo</span>
          </a>
        )}
      </div>
    </aside>
  );
}
