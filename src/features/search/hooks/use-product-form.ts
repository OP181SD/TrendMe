import { useCallback, useState } from "react";
import type { Product } from "@/lib/types";
import { blankProduct, exampleProduct } from "../product-presets";

export function useProductForm() {
  const [product, setProduct] = useState<Product>(blankProduct);
  const set = useCallback(
    (patch: Partial<Product>) => setProduct((cur) => ({ ...cur, ...patch })),
    [],
  );
  const setBrand = useCallback(
    (patch: Partial<Product["brand"]>) =>
      setProduct((cur) => ({ ...cur, brand: { ...cur.brand, ...patch } })),
    [],
  );
  const setStyle = useCallback(
    (patch: Partial<Product["style"]>) =>
      setProduct((cur) => ({ ...cur, style: { ...cur.style, ...patch } })),
    [],
  );
  const loadExample = useCallback(() => setProduct((cur) => exampleProduct(cur.id)), []);
  const setImageFile = useCallback(
    (file?: File) => {
      if (!file) return;
      const r = new FileReader();
      r.onload = () => set({ imageUrl: String(r.result) });
      r.readAsDataURL(file);
    },
    [set],
  );
  return { product, set, setBrand, setStyle, loadExample, setImageFile };
}

export type ProductForm = ReturnType<typeof useProductForm>;
