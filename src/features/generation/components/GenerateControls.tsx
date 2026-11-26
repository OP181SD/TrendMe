import { Sparkles } from "lucide-react";
import { ShinyText } from "@/components/reactbits";
import { Button } from "@/components/ui/button";
import type { TargetTool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MODES, TOOLS, type GenerationMode } from "../constants";

export function ModePicker({
  value,
  onChange,
}: {
  value: GenerationMode;
  onChange: (m: GenerationMode) => void;
}) {
  return (
    <div
      className="mt-8 grid gap-3 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Qui tourne la vidéo"
    >
      {MODES.map(([m, label, desc]) => (
        <button
          key={m}
          role="radio"
          aria-checked={value === m}
          onClick={() => onChange(m)}
          className={cn(
            "rounded-[1.5rem] border border-dashed bg-card p-5 text-left",
            value === m && "border-solid border-primary bg-primary/10",
          )}
        >
          <p className="font-bold">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </button>
      ))}
    </div>
  );
}

interface BarProps {
  mode: GenerationMode;
  tool: TargetTool;
  onTool: (t: TargetTool) => void;
  loading: boolean;
  disabled: boolean;
  onRun: () => void;
}

/** Choix de l'outil (mode IA seulement) + bouton Générer. */
export function GenerateBar({ mode, tool, onTool, loading, disabled, onRun }: BarProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[1.75rem] border border-dashed bg-card p-5">
      {mode === "ia" && (
        <>
          <span className="mr-2 text-sm text-muted-foreground">Format du prompt</span>
          {TOOLS.map((t) => (
            <button
              key={t}
              onClick={() => onTool(t)}
              className={cn(
                "rounded-full border border-dashed px-4 py-2 text-sm",
                tool === t ? "border-solid border-primary bg-primary/15" : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </>
      )}
      <Button
        size="lg"
        className="ml-auto min-w-52 rounded-full"
        onClick={onRun}
        disabled={loading || disabled}
      >
        {loading ? (
          <ShinyText text="Écriture de votre pub…" />
        ) : (
          <>
            <Sparkles /> {mode === "humain" ? "Générer mon script" : "Générer ma pub"}
          </>
        )}
      </Button>
    </div>
  );
}
