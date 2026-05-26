import type { CatalogueItemDTO, CategoryDTO } from "../types/category";

function apiUrl(path: string) {
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/*$/, "");
  if (!base) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchCategories(): Promise<CategoryDTO[]> {
  return fetchJson<CategoryDTO[]>("/api/categories");
}

export type CategoryCatalogResponse = {
  category: CategoryDTO;
  items: CatalogueItemDTO[];
};

export async function fetchCategoryCatalog(
  slug: string,
): Promise<CategoryCatalogResponse> {
  return fetchJson<CategoryCatalogResponse>(
    `/api/categories/${encodeURIComponent(slug)}/items`,
  );
}
