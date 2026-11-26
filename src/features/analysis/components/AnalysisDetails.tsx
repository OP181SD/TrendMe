import type { ReactNode } from "react";
import { BlurText, CountUp, FadeContent } from "@/components/reactbits";
import type { Analysis } from "@/lib/types";

export function HookQuote({ hook }: { hook: Analysis["hook"] }) {
  return (
    <blockquote className="mt-8 border-l-2 border-primary pl-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Hook · <span className="font-mono">{hook.seconds} s</span> · {hook.type}</p>
      <BlurText as="h2" text={`« ${hook.description} »`} className="mt-2 text-3xl font-bold leading-tight" />
    </blockquote>
  );
}

export function AnalysisSections({ a }: { a: Analysis }) {
  return (
    <FadeContent className="mt-8 grid gap-8 md:grid-cols-2">
      <Section title="Concept"><p className="text-lg font-medium">{a.concept}</p></Section>
      <Section title="Message"><p>{a.message}</p></Section>
      <Section title="Déroulé en 3 étapes"><Numbered items={a.storytelling} /></Section>
      <Section title="Trois raisons du succès"><Numbered items={a.why_it_works} /></Section>
      <Section title="Style visuel"><p>{a.visual_style}</p></Section>
      <Section title="CTA"><p>{a.cta}</p></Section>
    </FadeContent>
  );
}

export function BrandMatchCard({ match }: { match: Analysis["brandMatch"] }) {
  return (
    <div className="mt-8 rounded-[1.75rem] border border-dashed bg-card p-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Score de correspondance avec la marque</p>
      <div className="mt-2 flex items-end gap-2"><CountUp to={match.score} className="text-5xl text-primary" /><span className="mb-1.5 font-mono text-muted-foreground">/100</span></div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${match.score}%` }} /></div>
      <p className="mt-3 text-sm text-muted-foreground">{match.reason}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{title}</p>{children}</section>;
}

function Numbered({ items }: { items: readonly string[] }) {
  return <ol className="space-y-2">{items.map((it, i) => <li key={i} className="flex gap-3"><span className="font-mono text-primary">{i + 1}</span>{it}</li>)}</ol>;
}
