import type {
  CatalogueItemDTO,
  CategoryCatalogDTO,
  CategoryDTO,
} from "../types/category";

/**
 * API catalogue sur o2switch (PHP, même serveur que MySQL).
 * Obligatoire sur Vercel : VITE_CATALOG_API_URL au build.
 * Local sans cette variable : /api via Express (npm run dev:full).
 */
function catalogApiBase(): string | null {
  const raw = import.meta.env.VITE_CATALOG_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

function isSinglePhpEndpoint(base: string): boolean {
  return base.endsWith(".php");
}

function categoriesUrl(): string {
  const base = catalogApiBase();
  if (!base) return "/api/categories";
  return isSinglePhpEndpoint(base)
    ? `${base}?action=categories`
    : `${base}/categories.php`;
}

function itemsUrl(slug: string): string {
  const base = catalogApiBase();
  if (!base) {
    return `/api/categories/${encodeURIComponent(slug)}/items`;
  }
  return isSinglePhpEndpoint(base)
    ? `${base}?action=items&slug=${encodeURIComponent(slug)}`
    : `${base}/items.php?slug=${encodeURIComponent(slug)}`;
}

function featuredUrl(limit: number): string {
  const base = catalogApiBase();
  if (!base) return `/api/featured?limit=${limit}`;
  return isSinglePhpEndpoint(base)
    ? `${base}?action=featured&limit=${limit}`
    : `${base}/featured.php?limit=${limit}`;
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
    throw new Error(
      "L’API catalogue n’est pas disponible (réponse HTML). Uploadez hosting/sorel-catalog-api.php sur sorel-order.fr et définissez VITE_CATALOG_API_URL sur Vercel.",
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
