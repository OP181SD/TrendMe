import { CountUp, SpotlightCard } from "@/components/reactbits";
import { PlatformIcon, platformLabel } from "@/components/PlatformIcon";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Video } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  attractionTier,
  isTrending,
  viewsPerFollower,
  type AttractionTier,
  type MomentumInfo,
} from "@/lib/scoring";
import { shadowReach } from "@/lib/filters";
import { Eye, Heart } from "lucide-react";
import { MomentumBadge } from "@/components/MomentumBadge";
import { compact, hookText } from "@/lib/format";
import { memo } from "react";

const tierLabel: Record<AttractionTier, string> = {
  pepite: "Pépite virale",
  breakout: "Sort de sa commu",
  audience: "Reste dans sa commu",
  inconnu: "Attraction",
};

export function attractionScore(vfr: number | null): number | null {
  if (vfr === null || vfr <= 0) return vfr === null ? null : 0;
  return Math.round(Math.min(100, Math.max(0, 50 + 25 * Math.log2(vfr))));
}

interface Props {
  v: Video;
  format?: string | undefined;
  selected?: boolean;
  momentum?: MomentumInfo | undefined;

  onOpen?: (id: string) => void;

  onToggle?: (id: string) => void;
  checked?: boolean;
  toggleDisabled?: boolean;
}

export const VideoCard = memo(function VideoCard({
  v,
  format,
  selected,
  momentum,
  onOpen,
  onToggle,
  checked = false,
  toggleDisabled = false,
}: Props) {
  const hook = hookText(v);
  const vfr = viewsPerFollower(v);
  const tier = attractionTier(vfr);
  const attr = attractionScore(vfr);
  const tierStyle =
    tier === "pepite"
      ? "bg-primary text-primary-foreground"
      : tier === "breakout"
        ? "bg-primary/15 text-primary"
        : "bg-muted text-muted-foreground";
  return (
    <div className="flex flex-col gap-3">
      <SpotlightCard
        className={cn(
          "aspect-[9/16] text-ink-foreground transition-colors",
          selected && "ring-2 ring-primary",
        )}
      >
        {v.thumbnailUrl ? (
          <img
            src={v.thumbnailUrl}
            alt={`Miniature de @${v.creator.handle}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary/60 to-ink p-6">
            <p className="text-center text-xl font-bold leading-tight">« {hook} »</p>
          </div>
        )}
        <button
          onClick={() => onOpen?.(v.id)}
          aria-label={`Voir l'analyse de la vidéo de @${v.creator.handle}`}
          className="absolute inset-0 z-0"
        />
        <div className="pointer-events-none relative flex items-start justify-between gap-2 p-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 backdrop-blur">
            <PlatformIcon platform={v.platform} className="h-3.5 w-3.5" />
          </span>
          {shadowReach(v) === "cachee" && (
            <span
              title="Shadow reach : la vidéo vend une marque sans le déclarer dans la légende ni les hashtags"
              className="ml-auto rounded-full bg-ink/80 px-2.5 py-1 text-[11px] backdrop-blur"
            >
              Pub cachée
            </span>
          )}
          {isTrending(v) && (
            <span className="ml-auto mr-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
              Tendance
            </span>
          )}
          {format && (
            <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[11px] backdrop-blur">
              {format}
            </span>
          )}
        </div>
      </SpotlightCard>

      <div className="space-y-2 px-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium">@{v.creator.handle}</p>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            {vfr !== null ? `${compact(v.creator.followers)} abo` : platformLabel[v.platform]}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help space-y-1.5 rounded-2xl border border-dashed px-3 py-2">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <span
                  className={cn(
                    "min-w-0 truncate rounded-full px-2.5 py-1 text-center text-xs font-semibold",
                    tierStyle,
                  )}
                >
                  {tierLabel[tier]}
                </span>
                <span className="shrink-0 font-mono text-base leading-none text-primary">
                  {attr === null ? "—" : <CountUp to={attr} />}
                  <span className="text-[10px] text-muted-foreground">/100</span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${attr ?? 0}%` }}
                />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-60">
            Vues ÷ abonnés, sur 100. 50 = la vidéo touche autant de monde que le compte a d'abonnés.
            100 = 4× plus. 0 = moins d'un quart.
            {vfr !== null &&
              ` Ici : ${compact(v.views)} vues pour ${compact(v.creator.followers)} abonnés.`}
          </TooltipContent>
        </Tooltip>
        <div className="flex gap-3 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <CountUp to={v.views} />
            <MomentumBadge momentum={momentum} />
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <CountUp to={v.engagementRate} decimals={1} suffix="%" />
          </span>
        </div>
        {onToggle && (
          <label
            className={cn(
              "flex cursor-pointer items-center gap-2 text-xs",
              toggleDisabled && "cursor-not-allowed opacity-50",
            )}
          >
            <Checkbox
              checked={checked}
              disabled={toggleDisabled}
              onCheckedChange={() => onToggle(v.id)}
            />
            Ajouter aux inspirations
          </label>
        )}
      </div>
    </div>
  );
});
