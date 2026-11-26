// Mutator Orval : le client généré (src/lib/api/) appelle customFetch(url, init).
// Hors du dossier généré car orval `clean: true` vide src/lib/api/ à chaque génération.
// Rôle : préfixer la base URL du backend FastAPI (VITE_API_URL) et parser la réponse.

const BASE = import.meta.env["VITE_API_URL"] ?? "http://localhost:8000";

// On jette sur erreur HTTP (hooks TanStack Query -> onError, façade api.ts -> catch),
// et on renvoie directement le corps parsé du 200 (orval: includeHttpResponseReturnType=false).
export async function customFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(/^https?:\/\//.test(url) ? url : `${BASE}${url}`, init);
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data && typeof data === "object" && "detail" in data ? JSON.stringify((data as { detail: unknown }).detail) : "";
    throw new Error(`API ${res.status} ${res.statusText}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }
  return data as T;
}

export default customFetch;
