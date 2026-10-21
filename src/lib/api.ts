import type { CategoryDTO } from "../types/catalog";
import type {
  ArticleDetailDTO,
  CatalogueItemDTO,
  CategoryCatalogDTO,
} from "../types/category";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
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

export function fetchCategoryCatalog(slug: string): Promise<CategoryCatalogDTO> {
  const sp = new URLSearchParams({ view: "items", slug });
  return fetchJson<CategoryCatalogDTO>(`/api/categories?${sp}`);
}

export function fetchArticle(reference: string): Promise<ArticleDetailDTO> {
  const sp = new URLSearchParams({ view: "article", reference });
  return fetchJson<ArticleDetailDTO>(`/api/categories?${sp}`);
}

export function itemTitle(item: CatalogueItemDTO): string {
  const parts = [item.libelle, item.variante].filter(Boolean);
  return parts.join(" — ") || item.codeArticle || "Article";
}
