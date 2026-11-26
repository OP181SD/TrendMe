import { CountUp } from "@/components/reactbits";
import { MomentumBadge } from "@/components/MomentumBadge";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { MomentumInfo } from "@/lib/scoring";
import type { Video } from "@/lib/types";

export function VideoMetrics({ v, momentum }: { v: Video; momentum: MomentumInfo }) {
  const metrics = [
    {
      label: "Vues",
      node: (
        <span className="inline-flex items-center">
          <CountUp to={v.views} />
          <MomentumBadge
            momentum={momentum}
            className="ml-2 align-middle"
            iconClassName="h-4 w-4"
          />
        </span>
      ),
    },
    { label: "Engagement", node: <CountUp to={v.engagementRate} decimals={1} suffix="%" /> },
    {
      label: "Attraction",
      node:
        v.creator.followers > 0 ? (
          <CountUp to={v.views / v.creator.followers} decimals={1} suffix="×" />
        ) : (
          <span className="font-mono">—</span>
        ),
    },
    {
      label: "Score créa",
      node: (
        <>
          <CountUp to={v.score} />
          <span className="text-muted-foreground">/100</span>
        </>
      ),
    },
    {
      label: "Date",
      node: (
        <span className="font-mono">{new Date(v.publishedAt).toLocaleDateString("fr-FR")}</span>
      ),
    },
  ];
  return (
    <TooltipProvider delayDuration={150}>
      <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-dashed py-5 md:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <dt className="text-xs text-muted-foreground">{m.label}</dt>
            <dd className="mt-1 text-xl xl:text-2xl">{m.node}</dd>
          </div>
        ))}
      </dl>
    </TooltipProvider>
  );
}
