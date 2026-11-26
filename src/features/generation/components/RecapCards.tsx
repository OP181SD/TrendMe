import { FadeContent } from "@/components/reactbits";
import { platformLabel } from "@/components/PlatformIcon";
import type { Product } from "@/lib/types";

const CARD = "rounded-[1.75rem] border border-dashed bg-card p-6";

/** Récapitulatif recherche + marque avant génération. */
export function RecapCards({ product }: { product: Product }) {
  const { brand, style } = product;
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <FadeContent className={CARD}>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Recherche</p>
        <div className="mt-3 flex gap-4">
          {product.imageUrl && <img src={product.imageUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" />}
          <div><p className="text-lg font-bold">{product.name}</p><p className="mt-1 text-sm text-muted-foreground">{product.description}</p></div>
        </div>
        <p className="mt-4 border-t border-dashed pt-4 text-sm">{style.format} · <span className="font-mono">{style.durationSeconds} s</span> · {style.platform ? platformLabel[style.platform] : "Toutes plateformes"}</p>
      </FadeContent>
      <FadeContent delay={0.08} className={CARD}>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Marque</p>
        <p className="mt-3 text-lg font-bold">{brand.name || "—"}</p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <Row label="Ton" value={brand.tone} />
          <Row label="Cible" value={brand.target} />
          <Row label="Couleurs" value={brand.colors.join(", ")} />
        </dl>
      </FadeContent>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex gap-2"><dt className="text-muted-foreground">{label}</dt><dd>{value || "—"}</dd></div>;
}
