import type { RowDataPacket } from "mysql2";
import { pool } from "./db.js";

type CategoryRow = RowDataPacket & {
  nom: string;
  slug: string;
  article_count: number;
};

type ArticleRow = RowDataPacket & {
  id: number;
  reference: string | null;
  gamme: string | null;
  photo: string | null;
  couleur: string | null;
};

type VarianteRow = RowDataPacket & {
  nom: string;
  count: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCategories(opts?: {
  limit?: number;
  featured?: boolean;
}) {
  const limit = opts?.limit ? Math.min(opts.limit, 100) : 0;

  const sql = `
    SELECT gamme AS nom, COUNT(*) AS article_count
    FROM article
    WHERE gamme IS NOT NULL AND TRIM(gamme) != ''
    GROUP BY gamme
    HAVING article_count > 0
    ORDER BY article_count DESC, gamme ASC
    ${limit > 0 ? "LIMIT ?" : ""}
  `;
  const [rows] = await pool.query<CategoryRow[]>(
    sql,
    limit > 0 ? [limit] : [],
  );
  return rows.map((r, i) => ({
    id: i + 1,
    nom: r.nom,
    slug: slugify(r.nom),
    ordre: i,
    articleCount: Number(r.article_count),
  }));
}

export async function getCatalogFilters() {
  const [categories, variantes, totalProducts] = await Promise.all([
    getCategories(),
    getVariantes(),
    countArticles(),
  ]);
  return { categories, variantes, totalProducts };
}

async function countArticles(opts?: { category?: string; variante?: string }) {
  const conditions: string[] = ["1=1"];
  const params: string[] = [];
  if (opts?.category) {
    conditions.push("gamme = ?");
    params.push(opts.category);
  }
  if (opts?.variante) {
    conditions.push("couleur = ?");
    params.push(opts.variante);
  }
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS n FROM article WHERE ${conditions.join(" AND ")}`,
    params,
  );
  return Number(rows[0]?.n ?? 0);
}

async function getVariantes() {
  const [rows] = await pool.query<VarianteRow[]>(`
    SELECT couleur AS nom, COUNT(*) AS count
    FROM article
    WHERE couleur IS NOT NULL AND TRIM(couleur) != ''
    GROUP BY couleur
    ORDER BY count DESC, nom ASC
  `);
  return rows.map((r) => ({
    nom: r.nom,
    count: Number(r.count),
  }));
}

export async function getCatalogProducts(opts?: {
  category?: string;
  q?: string;
  variante?: string;
  sort?: "gamme" | "nom";
  limit?: number;
}) {
  const categoryName = opts?.category ?? "";
  const q = opts?.q?.trim() ?? "";
  const variante = opts?.variante?.trim() ?? "";
  const sort = opts?.sort === "nom" ? "nom" : "gamme";
  const limit = Math.min(opts?.limit ?? 48, 200);

  const conditions: string[] = ["gamme IS NOT NULL", "TRIM(gamme) != ''"];
  const params: Array<string | number> = [];

  if (categoryName) {
    conditions.push("gamme = ?");
    params.push(categoryName);
  }
  if (q) {
    conditions.push("(reference LIKE ? OR gamme LIKE ? OR couleur LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (variante) {
    conditions.push("couleur = ?");
    params.push(variante);
  }
  params.push(limit);

  const orderBy = sort === "nom" ? "reference ASC" : "gamme ASC, reference ASC";

  const [rows] = await pool.query<ArticleRow[]>(
    `
    SELECT id, reference, gamme, photo, couleur
    FROM article
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${orderBy}
    LIMIT ?
    `,
    params,
  );

  return rows.map((r) => ({
    id: r.id,
    libelle: r.reference ?? "Article",
    categorieId: 0,
    categoryNom: r.gamme ?? "",
    categorySlug: r.gamme ? slugify(r.gamme) : "",
    photo: r.photo,
    variantes: r.couleur ? [r.couleur] : [],
    variantCount: r.couleur ? 1 : 0,
  }));
}

export async function getArticles(
  opts?: Parameters<typeof getCatalogProducts>[0],
) {
  return getCatalogProducts(opts);
}

/** Quelques références mises en avant sur l'accueil. */
export async function getFeaturedItems(limit = 4) {
  const n = Math.max(1, Math.min(limit, 12));
  const [rows] = await pool.query<ArticleRow[]>(
    `
    SELECT id, reference, gamme, photo, couleur
    FROM article
    WHERE gamme IS NOT NULL AND TRIM(gamme) != ''
    ORDER BY id ASC
    LIMIT ?
    `,
    [n],
  );

  return rows.map((r) => ({
    id: r.id,
    codeArticle: r.reference?.trim() ?? null,
    libelle: r.reference ?? "Article",
    variante: r.couleur,
    photo: r.photo,
    categorySlug: r.gamme ? slugify(r.gamme) : "",
    categoryNom: r.gamme ?? "",
  }));
}

export async function getCategoryCatalog(slug: string) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return null;

  const [items] = await pool.query<ArticleRow[]>(
    `
    SELECT id, reference, gamme, photo, couleur
    FROM article
    WHERE gamme = ?
    ORDER BY reference ASC, couleur ASC
    `,
    [category.nom],
  );

  return {
    category: {
      id: category.id,
      nom: category.nom,
      slug: category.slug,
      ordre: category.ordre,
    },
    items: items.map((item) => ({
      id: item.id,
      codeArticle: item.reference?.trim() ?? null,
      libelle: item.reference ?? "Article",
      variante: item.couleur,
      photo: item.photo,
      categorySlug: category.slug,
      categoryNom: category.nom,
    })),
  };
}

export async function checkDb() {
  await pool.query("SELECT 1");
  return process.env.DB_NAME ?? "catalogue_sorel";
}
