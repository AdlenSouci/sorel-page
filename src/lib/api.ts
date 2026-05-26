import type { CategoryDTO } from "../types/category";

/** Local : npm run dev:full → /api/categories */
const LOCAL_CATEGORIES = "/api/categories";

/** Prod (Vercel) : fichier PHP sur le même serveur que la base */
const PROD_CATEGORIES =
  "https://sorel-order.fr/sorel-categories.php";

function categoriesUrl(): string {
  return import.meta.env.DEV ? LOCAL_CATEGORIES : PROD_CATEGORIES;
}

export async function fetchCategories(): Promise<CategoryDTO[]> {
  const res = await fetch(categoriesUrl());
  if (!res.ok) {
    throw new Error(`Erreur ${res.status} — vérifie sorel-categories.php sur le serveur`);
  }
  const data = (await res.json()) as CategoryDTO[] | { error?: string };
  if (!Array.isArray(data)) {
    throw new Error(
      typeof data === "object" && data && "error" in data
        ? String(data.error)
        : "Réponse invalide",
    );
  }
  return data;
}
