import type {
  ArticleSort,
  CatalogFiltersDTO,
  CatalogProductDTO,
  CategoryDTO,
} from "../types/catalog";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const text = await res.text();
  if (text.trimStart().startsWith("<")) {
    throw new Error("Impossible de charger le catalogue.");
  }
  const data = JSON.parse(text) as unknown;
  if (!res.ok) {
    throw new Error(
      typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error: string }).error === "string"
        ? (data as { error: string }).error
        : `HTTP ${res.status}`,
    );
  }
  return data as T;
}

export function fetchCategories(opts?: {
  limit?: number;
  featured?: boolean;
}): Promise<CategoryDTO[]> {
  const sp = new URLSearchParams();
  if (opts?.limit) sp.set("limit", String(opts.limit));
  if (opts?.featured) sp.set("featured", "1");
  const qs = sp.toString();
  return fetchJson<CategoryDTO[]>(`/api/categories${qs ? `?${qs}` : ""}`);
}

export function fetchCatalogFilters(): Promise<CatalogFiltersDTO> {
  return fetchJson("/api/categories?view=filters");
}

export function fetchCatalogProducts(params?: {
  category?: string;
  q?: string;
  variante?: string;
  sort?: ArticleSort;
  limit?: number;
}): Promise<CatalogProductDTO[]> {
  const sp = new URLSearchParams({ view: "products" });
  if (params?.category) sp.set("category", params.category);
  if (params?.q) sp.set("q", params.q);
  if (params?.variante) sp.set("variante", params.variante);
  if (params?.sort) sp.set("sort", params.sort);
  if (params?.limit) sp.set("limit", String(params.limit));
  return fetchJson<CatalogProductDTO[]>(`/api/categories?${sp}`);
}
