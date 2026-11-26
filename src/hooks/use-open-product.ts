import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { setState } from "@/lib/store";

/** Rend un dossier actif puis ouvre ses vidéos. */
export function useOpenProduct() {
  const navigate = useNavigate();
  return useCallback(
    (productId: string) => {
      setState((st) => ({ ...st, activeProductId: productId }));
      navigate({ to: "/top-videos" });
    },
    [navigate],
  );
}
