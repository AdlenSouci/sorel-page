import type {
  CatalogueItemDTO,
  CategoryCatalogDTO,
  CategoryDTO,
} from "../types/category";

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (text.trimStart().startsWith("<")) {
    throw new Error("Impossible de charger les données.");
  }
  const data = JSON.parse(text) as unknown;
  if (!res.ok) {
    throw new Error(
      typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error: string }).error === "string"
        ? (data as { error: string }).error
        : `Erreur ${res.status}`,
    );
  }
  return data as T;
}

export function resolvePhotoUrl(photo: string | null): string | null {
  if (!photo?.trim()) return null;
  const p = photo.trim();
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.VITE_MEDIA_BASE_URL?.trim().replace(/\/$/, "");
  if (base) return `${base}${p.startsWith("/") ? p : `/${p}`}`;
  return p.startsWith("/") ? p : `/${p}`;
}

export async function fetchCategories(): Promise<CategoryDTO[]> {
  const res = await fetch("/api/categories");
  return parseJson<CategoryDTO[]>(res);
}

export async function fetchCategoryCatalog(
  slug: string,
): Promise<CategoryCatalogDTO> {
  const sp = new URLSearchParams({ view: "items", slug });
  const res = await fetch(`/api/categories?${sp}`);
  return parseJson<CategoryCatalogDTO>(res);
}

export async function fetchFeaturedProducts(
  limit = 4,
): Promise<CatalogueItemDTO[]> {
  const res = await fetch(`/api/featured?limit=${limit}`);
  return parseJson<CatalogueItemDTO[]>(res);
}

export function itemTitle(item: CatalogueItemDTO): string {
  const parts = [item.libelle, item.variante].filter(Boolean);
  return parts.join(" — ") || item.codeArticle || "Article";
}
