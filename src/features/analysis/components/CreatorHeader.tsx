import { PlatformIcon, platformLabel } from "@/components/PlatformIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { compact } from "@/lib/format";
import type { Video } from "@/lib/types";

export function CreatorHeader({ v, format }: { v: Video; format: string }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-14 w-14">
        <AvatarFallback className="bg-primary/20 text-lg text-primary">
          {v.creator.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-bold">
          {v.creator.name}{" "}
          <span className="font-normal text-muted-foreground">@{v.creator.handle}</span>
        </p>
        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <PlatformIcon platform={v.platform} className="h-3.5 w-3.5" /> {platformLabel[v.platform]}{" "}
          · <span className="font-mono">{compact(v.creator.followers)}</span> abonnés
        </p>
      </div>
      <span className="ml-auto rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
        {format}
      </span>
    </div>
  );
}
