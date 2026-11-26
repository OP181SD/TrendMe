import { Folder, FolderOpen, Trash2 } from "lucide-react";
import type { Product, Video } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
  activeId: string | null;
  videos: Record<string, Video[]>;
  itemClassName: string;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Liste des dossiers de la barre latérale, avec nombre de vidéos et suppression au survol. */
export function SidebarProducts({ products, activeId, videos, itemClassName, onOpen, onDelete }: Props) {
  return (
    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
      {products.length === 0 && <p className="px-4 text-sm text-muted-foreground">Aucun dossier.</p>}
      {products.map((p) => {
        const active = p.id === activeId;
        const Icon = active ? FolderOpen : Folder;
        return (
          <div key={p.id} className={cn("group flex items-center rounded-full pr-1 transition-colors hover:bg-sidebar-accent", active && "bg-sidebar-accent")}>
            <button onClick={() => onOpen(p.id)} className={cn(itemClassName, "min-w-0 flex-1 text-left hover:bg-transparent", active && "text-foreground")}>
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              <span className="truncate">{p.name}</span>
              <span className="ml-auto font-mono text-xs">{videos[p.id]?.length ?? 0}</span>
            </button>
            <button
              onClick={() => onDelete(p.id)}
              aria-label={`Supprimer le dossier ${p.name}`}
              title="Supprimer ce dossier"
              className="shrink-0 rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus:opacity-100 group-hover:opacity-100">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
