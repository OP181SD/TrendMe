import { Wand2 } from "lucide-react";
import { PlatformIcon, platformLabel } from "@/components/PlatformIcon";
import type { Platform } from "@/lib/types";
import { Chip } from "./FormParts";

const PLATFORMS: Platform[] = ["tiktok", "instagram", "youtube"];

export function PlatformChips({ value, onChange, onExample }: { value: Platform | undefined; onChange: (p: Platform | undefined) => void; onExample: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip active={!value} onClick={() => onChange(undefined)}>Tous</Chip>
      {PLATFORMS.map((pl) => (
        <Chip key={pl} active={value === pl} onClick={() => onChange(pl)}><PlatformIcon platform={pl} /> {platformLabel[pl]}</Chip>
      ))}
      <button type="button" onClick={onExample} className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <Wand2 className="h-4 w-4" /> Exemple
      </button>
    </div>
  );
}
