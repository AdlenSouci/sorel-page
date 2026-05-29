import type {
  CatalogueItemDTO,
  CategoryCatalogDTO,
  CategoryDTO,
} from "../types/category";

/**
 * Catalogue : toujours l’API du site sorel-page (/api/…).
 * Sur https://sorel-page.vercel.app → /api/categories (serverless + MySQL).
 */
const API = "/api";

/** Photos : URL complète en base, sinon chemin relatif au site vitrine. */
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
      "Le serveur a renvoyé du HTML au lieu de JSON. Vérifiez DATABASE_URL (ou DB_*) sur Vercel, puis redéployez.",
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
  const res = await fetch(`${API}/categories`);
  return parseJson<CategoryDTO[]>(res);
}

export async function fetchCategoryCatalog(
  slug: string,
): Promise<CategoryCatalogDTO> {
  const res = await fetch(
    `${API}/categories/${encodeURIComponent(slug)}/items`,
  );
  return parseJson<CategoryCatalogDTO>(res);
}

export function itemTitle(item: CatalogueItemDTO): string {
  const parts = [item.libelle, item.variante].filter(Boolean);
  return parts.join(" — ") || item.codeArticle || "Article";
}
