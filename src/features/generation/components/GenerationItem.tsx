import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import type { Generation } from "@/lib/store";

export function GenerationItem({ g, productName }: { g: Generation; productName: string }) {
  const { copied, copy } = useCopy("Prompt copié");
  return (
    <div className="rounded-[2rem] border border-dashed bg-card p-6">
      <div className="flex flex-wrap items-center gap-3 border-b border-dashed pb-4 text-sm">
        <span className="rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground">{g.result.targetTool}</span>
        <span className="font-medium">{productName}</span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">{g.videos[0] && <PlatformIcon platform={g.videos[0].platform} className="h-3.5 w-3.5" />} {g.videos.map((v) => "@" + v.creator.handle).join(", ")}</span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">{new Date(g.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</span>
      </div>
      <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{g.result.scenes.map((sc) => sc.title).join(" → ")}</p>
      <Button asChild variant="secondary" className="mt-5 mr-2 rounded-full"><Link to="/prompt/$id" params={{ id: g.id }}>Ouvrir</Link></Button>
      <Button onClick={() => copy(g.result.prompt)} className="mt-5 rounded-full">{copied ? <Check /> : <Copy />} {copied ? "Copié" : "Copier le prompt"}</Button>
    </div>
  );
}
