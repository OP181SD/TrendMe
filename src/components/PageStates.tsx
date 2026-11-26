import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BlurText, ShinyText } from "@/components/reactbits";

type To = NonNullable<LinkProps["to"]>;
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  text,
  to,
  cta,
}: {
  title: string;
  text?: string;
  to: To;
  cta: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <BlurText text={title} className="text-4xl font-bold" />
      {text && <p className="mt-3 text-muted-foreground">{text}</p>}
      <Button asChild className="mt-6 rounded-full">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}

export function BackLink({
  to,
  label,
  className = "mb-6",
}: {
  to: To;
  label: string;
  className?: string;
}) {
  return (
    <Button asChild variant="ghost" className={`-ml-3 rounded-full ${className}`}>
      <Link to={to}>
        <ArrowLeft /> {label}
      </Link>
    </Button>
  );
}

export function PendingAnalyses({ count, className }: { count: number; className: string }) {
  if (count <= 0) return null;
  return (
    <ShinyText
      text={`Analyse de ${count} vidéo${count > 1 ? "s" : ""} en cours…`}
      className={className}
    />
  );
}
