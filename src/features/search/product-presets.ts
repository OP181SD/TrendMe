import type { Product } from "@/lib/types";

export const TONES = [
  "chaleureux et expert",
  "fun et décalé",
  "premium et élégant",
  "scientifique",
  "authentique et simple",
];
export const FORMATS = ["UGC", "tutoriel", "avant/après", "témoignage"];
export const DURATIONS = [15, 30, 60];

export const blankProduct = (): Product => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  imageUrl: "",
  brand: { name: "", tone: "", colors: [], target: "" },
  style: { format: "UGC", durationSeconds: 30 },
});

export const exampleProduct = (id: string): Product => ({
  id,
  name: "Sérum-Crème Renaissance",
  description:
    "Crème anti-âge au rétinol encapsulé et peptides, texture fondante, pour lisser les rides en 4 semaines.",
  imageUrl: "",
  brand: {
    name: "Maison Aube",
    tone: "chaleureux et expert",
    colors: ["bleu nuit", "blanc", "argent"],
    target: "femmes de 40 à 60 ans",
  },
  style: { format: "UGC", durationSeconds: 30 },
});
