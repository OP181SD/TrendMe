import { Switch } from "@/components/ui/switch";
import { setState } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DemoModeSwitch({ on }: { on: boolean }) {
  return (
    <div className="mt-4 border-t border-dashed pt-4">
      <label
        htmlFor="demo-mode"
        className="flex cursor-pointer items-center justify-between rounded-full px-4 py-2 text-sm"
      >
        <span className={cn(on ? "text-primary" : "text-muted-foreground")}>Mode démo</span>
        <Switch
          id="demo-mode"
          checked={on}
          onCheckedChange={(v) => setState((st) => ({ ...st, demoMode: v }))}
        />
      </label>
      {on && (
        <p className="px-4 text-xs text-muted-foreground">
          Vidéos enregistrées, sans appel réseau.
        </p>
      )}
    </div>
  );
}
