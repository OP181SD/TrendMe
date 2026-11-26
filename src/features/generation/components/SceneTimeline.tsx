import type { GeneratedPrompt } from "@/lib/types";

export function SceneTimeline({ scenes }: { scenes: GeneratedPrompt["scenes"] }) {
  return (
    <div className="mt-6 grid grid-cols-4 gap-1.5" aria-label="Chronologie des scènes">
      {scenes.map((sc) => (
        <div key={sc.title} className="rounded-2xl border border-dashed p-3">
          <p className="font-mono text-xs text-primary">
            {sc.start}–{sc.end} s
          </p>
          <p className="mt-1 truncate text-sm">{sc.title}</p>
        </div>
      ))}
    </div>
  );
}
