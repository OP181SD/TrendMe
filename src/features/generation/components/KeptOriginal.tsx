import { FadeContent } from "@/components/reactbits";
import { cn } from "@/lib/utils";

/** Deux colonnes : ce qui vient des inspirations / ce qui vient de la marque. */
export function KeptOriginal({ kept, original }: { kept: string[]; original: string[] }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Card title="Ce qui est repris" subtitle="La structure des vidéos d'inspiration" items={kept} />
      <Card title="Ce qui est original" subtitle="Ce qui vient de votre marque" items={original} highlight />
    </div>
  );
}

function Card({ title, subtitle, items, highlight }: { title: string; subtitle: string; items: string[]; highlight?: boolean }) {
  return (
    <FadeContent delay={highlight ? 0.08 : 0} className={cn("rounded-[1.75rem] border bg-card p-6", highlight ? "border-solid border-primary/50" : "border-dashed")}>
      <p className={cn("text-xs uppercase tracking-wider", highlight ? "text-primary" : "text-muted-foreground")}>{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <ul className="mt-4 space-y-2 border-t border-dashed pt-4">{items.map((it) => <li key={it} className="flex gap-2"><span className="text-primary">✦</span>{it}</li>)}</ul>
    </FadeContent>
  );
}
