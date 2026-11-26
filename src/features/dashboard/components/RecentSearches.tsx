import { FadeContent } from "@/components/reactbits";
import type { SearchEntry } from "@/lib/store";

export function RecentSearches({ searches }: { searches: SearchEntry[] }) {
  return (
    <section>
      <h2 className="border-b border-dashed pb-4 text-2xl font-bold">Dernières recherches</h2>
      {searches.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Aucune recherche encore.</p>
      ) : (
        <ul className="divide-y divide-dashed">
          {searches.slice(0, 6).map((r, i) => (
            <FadeContent key={r.id} delay={i * 0.05}>
              <li className="py-4">
                <p className="line-clamp-2 text-sm">{r.query}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{r.count} vidéos · {new Date(r.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</p>
              </li>
            </FadeContent>
          ))}
        </ul>
      )}
    </section>
  );
}
