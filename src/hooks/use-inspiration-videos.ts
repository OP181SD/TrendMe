import { useMemo } from "react";
import { getVideo } from "@/lib/api";
import type { Product, Video } from "@/lib/types";
import { useStore } from "@/lib/store";

/** Vidéos cochées comme inspirations pour le dossier, référence stable tant que le store ne change pas. */
export function useInspirationVideos(product: Product | null): Video[] {
  const s = useStore();
  const ids = product ? s.inspirations[product.id] : undefined;
  const pool = product ? s.videos[product.id] : undefined;
  return useMemo(() => (ids ?? []).map((id) => getVideo(id, pool ?? [])).filter((v): v is Video => !!v), [ids, pool]);
}
