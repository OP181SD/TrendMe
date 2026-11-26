export const compact = (n: number) =>
  new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const hookText = (v: { onScreenText: readonly string[] }) =>
  v.onScreenText[0]?.replace(/[«»"]/g, "").trim();
