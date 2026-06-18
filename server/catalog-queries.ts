import type { RowDataPacket } from "mysql2";
import { pool } from "./db.js";

type CategoryRow = RowDataPacket & {
  id: number;
  nom: string;
  slug: string;
  ordre: number;
  article_count: number;
};

type ProductRow = RowDataPacket & {
  id: number;
  libelle: string;
  categorie_id: number;
  category_nom: string;
  category_slug: string;
  photo: string | null;
  variantes_raw: string | null;
  variant_count: number;
};

type VarianteRow = RowDataPacket & {
  nom: string;
  count: number;
};

const CLEAN_CATEGORY_SQL = `
  c.slug NOT LIKE 'categorie-%'
  AND c.nom NOT REGEXP '^[0-9]+$'
  AND c.nom NOT LIKE 'CATEGORIE-%'
  AND LOWER(c.nom) NOT LIKE '%test%'
  AND c.nom NOT IN ('2023864', 'COUV.')
`;

/** Gammes dans le filtre latéral — top N avec articles */
const FILTER_GAMMES_LIMIT = 10;

let articlesTableCache: string | null = null;
let articlesHasActifCache: boolean | null = null;

async function getArticlesMeta() {
  if (articlesTableCache) {
    return { table: articlesTableCache, hasActif: articlesHasActifCache! };
  }

  const [rows] = await pool.query<RowDataPacket[]>(
  `SHOW TABLES LIKE 'catalogue_articles'`,
  );
  if (rows.length > 0) {
    articlesTableCache = "catalogue_articles";
    articlesHasActifCache = true;
    return { table: articlesTableCache, hasActif: true };
  }

  articlesTableCache = "catalogue";
  articlesHasActifCache = false;
  return { table: articlesTableCache, hasActif: false };
}

function activeArticleSql(alias: string, hasActif: boolean) {
  return hasActif ? `${alias}.actif = 1` : "1=1";
}

export async function getCategories(opts?: {
  limit?: number;
  featured?: boolean;
  forFilter?: boolean;
}) {
  const { table, hasActif } = await getArticlesMeta();
  const featured = opts?.featured ?? false;
  const forFilter =
    opts?.forFilter ?? (!opts?.limit && !featured);
  const limit = opts?.limit ? Math.min(opts.limit, 100) : 0;
  const effectiveLimit = forFilter
    ? FILTER_GAMMES_LIMIT
    : limit > 0
      ? limit
      : 0;
  const having = "HAVING article_count > 0";
  const order = featured || forFilter
    ? "ORDER BY article_count DESC, c.ordre ASC"
    : "ORDER BY c.ordre ASC, c.nom ASC";

  const sql = `
    SELECT c.id, c.nom, c.slug, c.ordre,
           COUNT(DISTINCT a.libelle) AS article_count
    FROM categories c
    INNER JOIN ${table} a
      ON a.categorie_id = c.id AND ${activeArticleSql("a", hasActif)}
    WHERE c.actif = 1
    AND ${CLEAN_CATEGORY_SQL}
    GROUP BY c.id, c.nom, c.slug, c.ordre
    ${having}
    ${order}
    ${effectiveLimit > 0 ? "LIMIT ?" : ""}
  `;
  const [rows] = await pool.query<CategoryRow[]>(
    sql,
    effectiveLimit > 0 ? [effectiveLimit] : [],
  );
  return rows.map((r) => ({
    id: r.id,
    nom: r.nom,
    slug: r.slug,
    ordre: r.ordre,
    articleCount: Number(r.article_count),
  }));
}

export async function getCatalogFilters() {
  const [categories, variantes, totalProducts] = await Promise.all([
    getCategories({ forFilter: true }),
    getVariantes(),
    countDistinctProducts(),
  ]);
  return { categories, variantes, totalProducts };
}

async function countDistinctProducts(opts?: { category?: string; variante?: string }) {
  const { table, hasActif } = await getArticlesMeta();
  const conditions = [
    activeArticleSql("a", hasActif),
    "c.actif = 1",
    CLEAN_CATEGORY_SQL.trim(),
  ];
  const params: string[] = [];
  if (opts?.category) {
    conditions.push("c.slug = ?");
    params.push(opts.category);
  }
  if (opts?.variante) {
    conditions.push("a.variante = ?");
    params.push(opts.variante);
  }
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT COUNT(DISTINCT CONCAT(a.categorie_id, '|', a.libelle)) AS n
    FROM ${table} a
    INNER JOIN categories c ON c.id = a.categorie_id
    WHERE ${conditions.join(" AND ")}
    `,
    params,
  );
  return Number(rows[0]?.n ?? 0);
}

async function getVariantes() {
  const { table, hasActif } = await getArticlesMeta();
  const [rows] = await pool.query<VarianteRow[]>(`
    SELECT a.variante AS nom, COUNT(DISTINCT CONCAT(a.categorie_id, '|', a.libelle)) AS count
    FROM ${table} a
    INNER JOIN categories c ON c.id = a.categorie_id
    WHERE ${activeArticleSql("a", hasActif)} AND c.actif = 1
      AND ${CLEAN_CATEGORY_SQL}
      AND a.variante IS NOT NULL AND TRIM(a.variante) != ''
      AND LOWER(a.variante) NOT LIKE 'test%'
    GROUP BY a.variante
    ORDER BY count DESC, nom ASC
  `);
  return rows.map((r) => ({
    nom: r.nom,
    count: Number(r.count),
  }));
}

function parseVariantes(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split("|").filter(Boolean);
}

export async function getCatalogProducts(opts?: {
  category?: string;
  q?: string;
  variante?: string;
  sort?: "gamme" | "nom";
  limit?: number;
}) {
  const { table, hasActif } = await getArticlesMeta();
  const categorySlug = opts?.category ?? "";
  const q = opts?.q?.trim() ?? "";
  const variante = opts?.variante?.trim() ?? "";
  const sort = opts?.sort === "nom" ? "nom" : "gamme";
  const limit = Math.min(opts?.limit ?? 48, 200);

  const conditions = [
    activeArticleSql("a", hasActif),
    "c.actif = 1",
    CLEAN_CATEGORY_SQL.trim(),
  ];
  const params: Array<string | number> = [];

  if (categorySlug) {
    conditions.push("c.slug = ?");
    params.push(categorySlug);
  }
  if (q) {
    conditions.push(
      "(a.libelle LIKE ? OR a.code_article LIKE ? OR a.variante LIKE ?)",
    );
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (variante) {
    conditions.push("a.variante = ?");
    params.push(variante);
  }
  params.push(limit);

  const orderBy =
    sort === "nom"
      ? "a.libelle ASC, c.ordre ASC"
      : hasActif
        ? "c.ordre ASC, MIN(a.ordre) ASC, a.libelle ASC"
        : "c.ordre ASC, MIN(a.id) ASC, a.libelle ASC";

  const [rows] = await pool.query<ProductRow[]>(
    `
    SELECT MIN(a.id) AS id,
           a.libelle,
           a.categorie_id,
           c.nom AS category_nom,
           c.slug AS category_slug,
           MIN(a.photo) AS photo,
           GROUP_CONCAT(DISTINCT a.variante ORDER BY a.variante SEPARATOR '|') AS variantes_raw,
           COUNT(DISTINCT a.variante) AS variant_count
    FROM ${table} a
    INNER JOIN categories c ON c.id = a.categorie_id
    WHERE ${conditions.join(" AND ")}
    GROUP BY a.libelle, a.categorie_id, c.nom, c.slug, c.ordre
    ORDER BY ${orderBy}
    LIMIT ?
    `,
    params,
  );

  return rows.map((r) => ({
    id: r.id,
    libelle: r.libelle,
    categorieId: r.categorie_id,
    categoryNom: r.category_nom,
    categorySlug: r.category_slug,
    photo: r.photo,
    variantes: parseVariantes(r.variantes_raw),
    variantCount: Number(r.variant_count),
  }));
}

export async function getArticles(opts?: Parameters<typeof getCatalogProducts>[0]) {
  return getCatalogProducts(opts);
}

export async function checkDb() {
  await pool.query("SELECT 1");
  return process.env.DB_NAME ?? process.env.DB_DATABASE ?? "sorel_local";
}
