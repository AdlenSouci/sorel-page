import type {
  ArticleSort,
  CatalogFiltersDTO,
  CatalogProductDTO,
  CategoryDTO,
} from "../types/catalog";

const useStaticCatalog = import.meta.env.PROD;

let productsCache: CatalogProductDTO[] | null = null;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const text = await res.text();
  const trimmed = text.trimStart();

  if (trimmed.startsWith("<") || trimmed.startsWith("<!")) {
    throw new Error(
      "Données catalogue introuvables. Attendez la fin du déploiement Vercel ou videz le cache du navigateur.",
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    throw new Error("Réponse invalide (pas du JSON).");
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

function filterProducts(
  all: CatalogProductDTO[],
  params?: {
    category?: string;
    q?: string;
    variante?: string;
    sort?: ArticleSort;
    limit?: number;
  },
): CatalogProductDTO[] {
  let rows = all;

  if (params?.category) {
    rows = rows.filter((p) => p.categorySlug === params.category);
  }
  if (params?.variante) {
    rows = rows.filter((p) => p.variantes.includes(params.variante!));
  }
  if (params?.q?.trim()) {
    const q = params.q.trim().toLowerCase();
    rows = rows.filter(
      (p) =>
        p.libelle.toLowerCase().includes(q) ||
        p.categoryNom.toLowerCase().includes(q) ||
        p.variantes.some((v) => v.toLowerCase().includes(q)),
    );
  }

  const sort = params?.sort === "nom" ? "nom" : "gamme";
  rows = [...rows].sort((a, b) => {
    if (sort === "nom") {
      return a.libelle.localeCompare(b.libelle, "fr");
    }
    const byGamme = a.categoryNom.localeCompare(b.categoryNom, "fr");
    return byGamme !== 0 ? byGamme : a.libelle.localeCompare(b.libelle, "fr");
  });

  const limit = params?.limit ?? 48;
  return rows.slice(0, limit);
}

export function fetchCategories(opts?: {
  limit?: number;
  featured?: boolean;
}): Promise<CategoryDTO[]> {
  if (useStaticCatalog) {
    return fetchJson<CategoryDTO[]>("/catalog/categories.json").then((rows) => {
      let list = rows;
      if (opts?.featured) {
        list = [...list].sort((a, b) => b.articleCount - a.articleCount);
      }
      if (opts?.limit) {
        list = list.slice(0, opts.limit);
      }
      return list;
    });
  }

  const sp = new URLSearchParams();
  if (opts?.limit) sp.set("limit", String(opts.limit));
  if (opts?.featured) sp.set("featured", "1");
  const qs = sp.toString();
  return fetchJson<CategoryDTO[]>(`/api/categories${qs ? `?${qs}` : ""}`);
}

export function fetchCatalogFilters(): Promise<CatalogFiltersDTO> {
  return useStaticCatalog
    ? fetchJson("/catalog/filters.json")
    : fetchJson("/api/categories?view=filters");
}

export async function fetchCatalogProducts(params?: {
  category?: string;
  q?: string;
  variante?: string;
  sort?: ArticleSort;
  limit?: number;
}): Promise<CatalogProductDTO[]> {
  if (!useStaticCatalog) {
    const sp = new URLSearchParams({ view: "products" });
    if (params?.category) sp.set("category", params.category);
    if (params?.q) sp.set("q", params.q);
    if (params?.variante) sp.set("variante", params.variante);
    if (params?.sort) sp.set("sort", params.sort);
    if (params?.limit) sp.set("limit", String(params.limit));
    return fetchJson<CatalogProductDTO[]>(`/api/categories?${sp}`);
  }

  if (!productsCache) {
    productsCache = await fetchJson<CatalogProductDTO[]>("/catalog/products.json");
  }
  return filterProducts(productsCache, params);
}
