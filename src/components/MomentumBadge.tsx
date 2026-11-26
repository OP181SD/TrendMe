import { TrendingDown, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { compact } from "@/lib/format";
import type { MomentumInfo } from "@/lib/scoring";
import { cn } from "@/lib/utils";

/** Flèche hausse/baisse des vues avec explication au survol. Rien si tendance plate. Doit être sous un TooltipProvider. */
export function MomentumBadge({
  momentum,
  className,
  iconClassName = "h-3.5 w-3.5",
}: {
  momentum?: MomentumInfo | undefined;
  className?: string;
  iconClassName?: string;
}) {
  if (!momentum || momentum.momentum === "flat") return null;
  const up = momentum.momentum === "up";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-help items-center rounded-full px-1.5 py-0.5",
            up ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            className,
          )}
          aria-label={up ? "Vues en hausse" : "Vues en baisse"}
        >
          {up ? (
            <TrendingUp className={iconClassName} />
          ) : (
            <TrendingDown className={iconClassName} />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-60">
        {compact(Math.round(momentum.perDay))} vues par jour depuis la publication —{" "}
        {momentum.ratio.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} fois la moyenne des
        autres vidéos de la recherche.
      </TooltipContent>
    </Tooltip>
  );
}
