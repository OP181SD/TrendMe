import { PlatformIcon, platformLabel } from "@/components/PlatformIcon";
import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

export type PlatformFilter = Platform | "all";
const OPTIONS = ["all", "tiktok", "instagram", "youtube"] as const;

export function PlatformTabs({
  value,
  onChange,
}: {
  value: PlatformFilter;
  onChange: (p: PlatformFilter) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {OPTIONS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-sm",
            value === p ? "border-solid border-primary bg-primary/15" : "text-muted-foreground",
          )}
        >
          {p !== "all" && <PlatformIcon platform={p} className="h-3.5 w-3.5" />}
          {p === "all" ? "Toutes" : platformLabel[p]}
        </button>
      ))}
    </div>
  );
}
