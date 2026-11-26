/** 12 345 → « 12,3 k » (fr-FR, notation compacte). */
export const compact = (n: number) =>
  new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(n);

/** Premier texte à l'écran, sans guillemets : sert d'accroche quand il n'y a pas de miniature. */
export const hookText = (v: { onScreenText: readonly string[] }) =>
  v.onScreenText[0]?.replace(/[«»"]/g, "").trim();
