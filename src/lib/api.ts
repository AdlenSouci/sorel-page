import type {
  CatalogueItemDTO,
  CategoryCatalogDTO,
  CategoryDTO,
} from "../types/category";

function catalogApiBase(): string | null {
  const raw = import.meta.env.VITE_CATALOG_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

function mediaBase(): string {
  const order = import.meta.env.VITE_SOREL_ORDER_URL?.trim();
  if (order) return order.replace(/\/$/, "");
  const api = catalogApiBase();
  if (api) {
    try {
      return new URL(api).origin;
    } catch {
      return "";
    }
  }
  return "";
}

/** URL absolue pour les photos stockées en chemin relatif sur sorel-order. */
export function resolvePhotoUrl(photo: string | null): string | null {
  if (!photo?.trim()) return null;
  const p = photo.trim();
  if (/^https?:\/\//i.test(p)) return p;
  const base = mediaBase();
  if (!base) return p.startsWith("/") ? p : `/${p}`;
  return `${base}${p.startsWith("/") ? p : `/${p}`}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

/**
 * Catégories : API PHP sur o2switch (VITE_CATALOG_API_URL) ou Express local (/api).
 */
export async function fetchCategories(): Promise<CategoryDTO[]> {
  const base = catalogApiBase();
  const url = base ? `${base}/categories.php` : "/api/categories";
  return parseJson<CategoryDTO[]>(await fetch(url));
}

/**
 * Articles d'une catégorie (même source que fetchCategories).
 */
export async function fetchCategoryCatalog(
  slug: string,
): Promise<CategoryCatalogDTO> {
  const base = catalogApiBase();
  const url = base
    ? `${base}/items.php?slug=${encodeURIComponent(slug)}`
    : `/api/categories/${encodeURIComponent(slug)}/items`;
  return parseJson<CategoryCatalogDTO>(await fetch(url));
}

export function itemTitle(item: CatalogueItemDTO): string {
  const parts = [item.libelle, item.variante].filter(Boolean);
  return parts.join(" — ") || item.codeArticle || "Article";
}
