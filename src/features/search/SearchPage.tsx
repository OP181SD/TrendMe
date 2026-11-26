import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BlurText } from "@/components/reactbits";
import { imageForSearch, search, SearchFailed } from "@/lib/api";
import { getState, setState, useStore } from "@/lib/store";
import { PlatformChips } from "./components/PlatformChips";
import { ProductOptions } from "./components/ProductOptions";
import { SearchBar } from "./components/SearchBar";
import { useProductForm } from "./hooks/use-product-form";

export function SearchPage() {
  const navigate = useNavigate();
  const s = useStore();
  const form = useProductForm();
  const { product: p, set, setStyle, loadExample } = form;
  const [loading, setLoading] = useState(false);
  const [useImage, setUseImage] = useState(true);
  // Masquée si Oriane a déjà refusé une image, en mode démo, ou si le format n'est pas JPG/PNG/WebP.
  const canUseImage = !s.imageSearchUnsupported && !s.demoMode && !!imageForSearch(p.imageUrl);

  async function finish() {
    setLoading(true);
    const product = { ...p, createdAt: new Date().toISOString() };
    let videos;
    try {
      const res = await search(product, {
        demo: getState().demoMode,
        useImage: canUseImage && useImage,
      });
      videos = res.videos;
      if (res.imageUnsupported) {
        setState((st) => ({ ...st, imageSearchUnsupported: true }));
        toast.info(
          "La recherche par image n'est pas disponible : résultats trouvés avec la description seule.",
        );
      }
    } catch (e) {
      setLoading(false);
      const demoOn = getState().demoMode;
      toast.error(e instanceof SearchFailed ? e.message : "La recherche a échoué.", {
        description: demoOn
          ? "Aucune vidéo enregistrée pour la démo."
          : "Passez en mode démo pour utiliser les vidéos déjà enregistrées.",
        duration: 12000,
        ...(demoOn
          ? {}
          : {
              action: {
                label: "Passer en mode démo",
                onClick: () => {
                  setState((st) => ({ ...st, demoMode: true }));
                  void finish();
                },
              },
            }),
      });
      return;
    }
    setState((st) => ({
      ...st,
      products: [product, ...st.products],
      activeProductId: product.id,
      videos: { ...st.videos, [product.id]: videos },
      searches: [
        {
          id: crypto.randomUUID(),
          productId: product.id,
          query: product.description,
          count: videos.length,
          createdAt: new Date().toISOString(),
        },
        ...st.searches,
      ],
    }));
    setLoading(false);
    navigate({ to: "/top-videos" });
  }

  const ready = !!p.name.trim() && !loading;
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <BlurText text="Trouver des inspirations" className="text-5xl font-bold tracking-tight" />
      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) void finish();
        }}
      >
        <SearchBar
          value={p.name}
          onChange={(name) => set({ name, description: name })}
          loading={loading}
          disabled={!ready}
        />
        <PlatformChips
          value={p.style.platform}
          onChange={(platform) => setStyle({ platform })}
          onExample={loadExample}
        />
        <ProductOptions
          form={form}
          canUseImage={canUseImage}
          useImage={useImage}
          onUseImage={setUseImage}
        />
      </form>
    </div>
  );
}
