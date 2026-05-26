import type { CategoryDTO } from "../types/category";
import categoriesProd from "../data/categories.prod.json";

/** Production (Vercel) : données dans le site. Local : API Express. */
export async function fetchCategories(): Promise<CategoryDTO[]> {
  if (import.meta.env.PROD) {
    return categoriesProd as CategoryDTO[];
  }

  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json() as Promise<CategoryDTO[]>;
}
