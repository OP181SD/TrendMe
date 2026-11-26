import { Link } from "@tanstack/react-router";
import { BlurText, FadeContent } from "@/components/reactbits";
import { useStore } from "@/lib/store";
import { GenerationItem } from "./components/GenerationItem";

export function GenerationsPage() {
  const s = useStore();
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <BlurText
        text="Générations"
        className="border-b border-dashed pb-6 text-5xl font-bold tracking-tight"
      />
      {s.generations.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          Aucun prompt pour l'instant.{" "}
          <Link to="/top-videos" className="text-primary">
            Analysez une vidéo
          </Link>{" "}
          puis cliquez sur « Générer ma pub ».
        </p>
      )}
      <div className="mt-8 space-y-5">
        {s.generations.map((g, i) => (
          <FadeContent key={g.id} delay={i * 0.06}>
            <GenerationItem
              g={g}
              productName={s.products.find((p) => p.id === g.productId)?.name ?? "Recherche"}
            />
          </FadeContent>
        ))}
      </div>
    </div>
  );
}
