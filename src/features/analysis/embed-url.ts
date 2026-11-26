import type { Video } from "@/lib/types";

/** Renvoie une URL d'intégration seulement pour les vraies vidéos (identifiants plausibles). */
export function embedUrl(v: Video): string | null {
  const tt = v.url.match(/tiktok\.com\/@[^/]+\/video\/(\d{15,})/);
  if (tt) return `https://www.tiktok.com/player/v1/${tt[1]}?music_info=0&description=0&rel=0`;
  const ig = v.url.match(/instagram\.com\/(?:reel|p)\/([\w-]{8,})/);
  if (ig) return `https://www.instagram.com/reel/${ig[1]}/embed`;
  const yt = v.url.match(/(?:shorts\/|v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}
