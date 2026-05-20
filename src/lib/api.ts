import type { ProductDTO } from "../types/product";
import { DEMO_CATALOG } from "../data/demoCatalog";

function apiUrl(path: string) {
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/*$/, "");
  if (!base) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Lecture API stricte (échoue si pas de serveur). */
export async function fetchProducts(): Promise<ProductDTO[]> {
  return fetchJson<ProductDTO[]>("/api/products");
}

/**
 * Essaie l’API, sinon renvoie le catalogue démo (pas de base requise).
 */
export async function getCatalogProducts(): Promise<{
  source: "api" | "demo";
  products: ProductDTO[];
}> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2500);

  try {
    const products = await fetchJson<ProductDTO[]>("/api/products", {
      signal: controller.signal,
    });
    window.clearTimeout(timeout);
    return { source: "api", products };
  } catch {
    window.clearTimeout(timeout);
    const sorted = [...DEMO_CATALOG].sort((a, b) => a.sortOrder - b.sortOrder);
    return { source: "demo", products: sorted };
  }
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  const ctrl = new AbortController();
  const tid = window.setTimeout(() => ctrl.abort(), 2500);
  try {
    const p = await fetchJson<ProductDTO>(
      `/api/products/${encodeURIComponent(slug)}`,
      { signal: ctrl.signal },
    );
    window.clearTimeout(tid);
    return p;
  } catch {
    window.clearTimeout(tid);
    return DEMO_CATALOG.find((q) => q.slug === slug) ?? null;
  }
}
