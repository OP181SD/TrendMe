import { Link } from "@tanstack/react-router";
import { Folder, Plus, Trash2 } from "lucide-react";
import { FadeContent } from "@/components/reactbits";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

export function ProductList({ products, onOpen, onDelete }: { products: Product[]; onOpen: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <section>
      <div className="flex items-end justify-between border-b border-dashed pb-4">
        <h2 className="text-2xl font-bold">Mes recherches</h2>
        <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/produits"><Plus /> Trouver des inspirations</Link></Button>
      </div>
      {products.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Rien ici. Lancez votre première recherche.</p>
      ) : (
        <ul className="divide-y divide-dashed">
          {products.map((p, i) => (
            <FadeContent key={p.id} delay={i * 0.05}>
              <li className="group flex items-center gap-1">
                <button onClick={() => onOpen(p.id)} className="flex min-w-0 flex-1 items-center gap-4 py-4 text-left hover:text-primary">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-11 w-11 rounded-xl object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted"><Folder className="h-4 w-4 text-primary" /></span>}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">{p.brand.name || "Sans marque"}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString("fr-FR") : "—"}</span>
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  aria-label={`Supprimer le dossier ${p.name}`}
                  title="Supprimer ce dossier"
                  className="shrink-0 rounded-full p-2 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus:opacity-100 group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            </FadeContent>
          ))}
        </ul>
      )}
    </section>
  );
}
