import type {
  CatalogueItemDTO,
  CategoryCatalogDTO,
  CategoryDTO,
} from "../types/category";

const useStaticCatalog = import.meta.env.PROD;

async function parseJson<T>(res: Response): Promise<T> {
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
        : `Erreur ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

function staticCategoryUrl(slug: string): string {
  return `/catalog/${encodeURIComponent(slug)}.json`;
}

function categoriesUrl(): string {
  return useStaticCatalog ? "/catalog/categories.json" : "/api/categories";
}

function itemsUrl(slug: string): string {
  return useStaticCatalog ? staticCategoryUrl(slug) : `/api/items?slug=${encodeURIComponent(slug)}`;
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

export async function fetchCategories(): Promise<CategoryDTO[]> {
  const res = await fetch(categoriesUrl());
  return parseJson<CategoryDTO[]>(res);
}

export async function fetchCategoryCatalog(
  slug: string,
): Promise<CategoryCatalogDTO> {
  const res = await fetch(itemsUrl(slug));
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
