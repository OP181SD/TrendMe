import type { TargetTool } from "@/lib/types";

export const TOOLS: TargetTool[] = ["Veo", "Sora", "Kling", "Runway"];
export type GenerationMode = "ia" | "humain";
export const MODES: readonly (readonly [GenerationMode, string, string])[] = [
  ["humain", "Je la tourne moi-même", "Script de tournage au téléphone, prêt à filmer"],
  ["ia", "Générée par IA", "Prompt pour Veo, Sora, Kling ou Runway"],
];
