import type {
  CatalogueItemDTO,
  CategoryCatalogDTO,
  CategoryDTO,
} from "../types/category";
import {
  BUILD_ID,
  catalogCategories,
  categoryCatalogs,
} from "../generated/catalog-data";

export { BUILD_ID };

function categoryItemsUrl(slug: string): string {
  const sp = new URLSearchParams({ view: "items", slug });
  return `/api/categories?${sp}`;
}

function featuredUrl(limit: number): string {
  return `/api/featured?limit=${limit}`;
}

/** Préfixe pour photos en chemin relatif (/storage/…) */
export function resolvePhotoUrl(photo: string | null): string | null {
  if (!photo?.trim()) return null;
  const p = photo.trim();
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.VITE_MEDIA_BASE_URL?.trim().replace(/\/$/, "");
  if (base) return `${base}${p.startsWith("/") ? p : `/${p}`}`;
  return p.startsWith("/") ? p : `/${p}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  const trimmed = text.trimStart();

  if (trimmed.startsWith("<") || trimmed.startsWith("<!")) {
    throw new Error("Impossible de charger les articles.");
  }

  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    throw new Error("Réponse invalide du serveur.");
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Erreur ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function fetchCategories(): Promise<CategoryDTO[]> {
  if (import.meta.env.PROD && catalogCategories.length > 0) {
    return catalogCategories;
  }
  const res = await fetch("/api/categories");
  return parseJson<CategoryDTO[]>(res);
}

export async function fetchCategoryCatalog(
  slug: string,
): Promise<CategoryCatalogDTO> {
  if (import.meta.env.PROD) {
    const data = categoryCatalogs[slug];
    if (!data) throw new Error("Catégorie introuvable.");
    return data;
  }
  const res = await fetch(categoryItemsUrl(slug));
  return parseJson<CategoryCatalogDTO>(res);
}

export async function fetchFeaturedProducts(
  limit = 4,
): Promise<CatalogueItemDTO[]> {
  const res = await fetch(featuredUrl(limit));
  return parseJson<CatalogueItemDTO[]>(res);
}

export function itemTitle(item: CatalogueItemDTO): string {
  const parts = [item.libelle, item.variante].filter(Boolean);
  return parts.join(" — ") || item.codeArticle || "Article";
}
