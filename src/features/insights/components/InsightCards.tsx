import { CountUp, FadeContent } from "@/components/reactbits";
import type { Insights } from "@/lib/insights";
import { cn } from "@/lib/utils";

const CARD = "rounded-[1.75rem] border border-dashed bg-card p-6";
const LABEL = "text-xs uppercase tracking-wider text-muted-foreground";

/** « À retenir » + engagement moyen des meilleures vs des autres. */
export function InsightCards({ r }: { r: Insights }) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <FadeContent className={CARD}>
        <p className={LABEL}>À retenir</p>
        <p className="mt-3 text-2xl font-bold leading-tight">{r.headline ?? "En attente des analyses…"}</p>
        {r.formats[0] && <p className="mt-3 text-muted-foreground"><span className="font-mono text-foreground">{r.formats[0].percent} %</span> sont au format {r.formats[0].label}.</p>}
      </FadeContent>
      <EngagementCard label="Engagement moyen · meilleures" value={r.avgEngagementTop} />
      <EngagementCard label="Engagement moyen · les autres" value={r.avgEngagementRest} muted />
    </div>
  );
}

function EngagementCard({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <FadeContent className={CARD}>
      <p className={LABEL}>{label}</p>
      <p className={cn("mt-3 font-mono text-4xl", muted && "text-muted-foreground")}><CountUp to={value} decimals={1} suffix=" %" /></p>
    </FadeContent>
  );
}
