import type { CategoryDTO } from "../types/category";
import categoriesProd from "../data/categories.prod.json";

export async function fetchCategories(): Promise<CategoryDTO[]> {
  if (import.meta.env.DEV) {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return res.json() as Promise<CategoryDTO[]>;
  }

  return categoriesProd as CategoryDTO[];
}
