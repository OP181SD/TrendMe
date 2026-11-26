const BASE = import.meta.env["VITE_API_URL"] ?? "http://localhost:8000";

export async function customFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(/^https?:\/\//.test(url) ? url : `${BASE}${url}`, init);
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data
        ? JSON.stringify((data as { detail: unknown }).detail)
        : "";
    throw new Error(
      `API ${res.status} ${res.statusText}${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }
  return data as T;
}

export default customFetch;
