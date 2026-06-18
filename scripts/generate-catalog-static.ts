import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCategoryCatalog, listCategories } from "../lib/catalog.js";
import { ensureDatabaseUrl } from "../lib/database-url.js";
import { prisma } from "../lib/db.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "public", "catalog");

function isCleanCategory(nom: string, slug: string): boolean {
  if (slug.startsWith("categorie-")) return false;
  if (nom.startsWith("CATEGORIE-")) return false;
  if (/^\d+$/.test(nom)) return false;
  if (nom.toLowerCase().includes("test")) return false;
  if (nom === "2023864" || nom === "COUV.") return false;
  return true;
}

async function writeJson(name: string, data: unknown) {
  await writeFile(
    path.join(outDir, name),
    `${JSON.stringify(data)}\n`,
    "utf8",
  );
}

async function getFilters() {
  const categories = await prisma.category.findMany({
    orderBy: [{ ordre: "asc" }, { nom: "asc" }],
    include: {
      catalogue: { select: { libelle: true, variante: true } },
    },
  });

  const cleaned = categories.filter((c) => isCleanCategory(c.nom, c.slug));
  const withCount = cleaned
    .map((c) => {
      const libelles = new Set(c.catalogue.map((a) => a.libelle));
      return {
        id: c.id,
        nom: c.nom,
        slug: c.slug,
        ordre: c.ordre,
        articleCount: libelles.size,
      };
    })
    .filter((c) => c.articleCount > 0)
    .sort((a, b) => b.articleCount - a.articleCount);

  const topGammes = withCount.slice(0, 10);

  const varianteMap = new Map<string, number>();
  for (const cat of cleaned) {
    const seen = new Set<string>();
    for (const item of cat.catalogue) {
      const key = `${cat.id}|${item.libelle}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const v = item.variante?.trim();
      if (!v || v.toLowerCase().startsWith("test")) continue;
      varianteMap.set(v, (varianteMap.get(v) ?? 0) + 1);
    }
  }

  const variantes = [...varianteMap.entries()]
    .map(([nom, count]) => ({ nom, count }))
    .sort((a, b) => b.count - a.count || a.nom.localeCompare(b.nom, "fr"));

  return {
    categories: topGammes,
    variantes,
    totalProducts: withCount.reduce((n, c) => n + c.articleCount, 0),
  };
}

async function getProducts() {
  const rows = await prisma.catalogue.findMany({
    include: { categorie: true },
    orderBy: [{ categorieId: "asc" }, { libelle: "asc" }],
  });

  const grouped = new Map<
    string,
    {
      id: number;
      libelle: string;
      categorieId: number;
      categoryNom: string;
      categorySlug: string;
      photo: string | null;
      variantes: Set<string>;
    }
  >();

  for (const row of rows) {
    const cat = row.categorie;
    if (!isCleanCategory(cat.nom, cat.slug)) continue;
    const key = `${cat.id}|${row.libelle}`;
    let entry = grouped.get(key);
    if (!entry) {
      entry = {
        id: row.id,
        libelle: row.libelle,
        categorieId: cat.id,
        categoryNom: cat.nom,
        categorySlug: cat.slug,
        photo: row.photo,
        variantes: new Set(),
      };
      grouped.set(key, entry);
    }
    if (row.variante?.trim()) entry.variantes.add(row.variante.trim());
    if (!entry.photo && row.photo) entry.photo = row.photo;
  }

  return [...grouped.values()].map((p) => ({
    id: p.id,
    libelle: p.libelle,
    categorieId: p.categorieId,
    categoryNom: p.categoryNom,
    categorySlug: p.categorySlug,
    photo: p.photo,
    variantes: [...p.variantes].sort((a, b) => a.localeCompare(b, "fr")),
    variantCount: p.variantes.size,
  }));
}

async function main() {
  ensureDatabaseUrl();

  const hasDb =
    Boolean(process.env.DATABASE_URL?.trim()) ||
    Boolean(process.env.DB_HOST?.trim());
  if (!hasDb) {
    console.warn(
      "[catalog-static] Pas de DB configurée — fichiers catalogue non générés.",
    );
    return;
  }

  await mkdir(outDir, { recursive: true });

  const [filters, products, categories] = await Promise.all([
    getFilters(),
    getProducts(),
    listCategories(),
  ]);

  const cleanedCategories = categories
    .filter((c) => isCleanCategory(c.nom, c.slug) && (c.productCount ?? 0) > 0)
    .map((c) => ({
      id: c.id,
      nom: c.nom,
      slug: c.slug,
      ordre: c.ordre,
      articleCount: c.productCount ?? 0,
    }));

  await Promise.all([
    writeJson("filters.json", filters),
    writeJson("products.json", products),
    writeJson("categories.json", cleanedCategories),
  ]);

  let written = 0;
  for (const category of cleanedCategories) {
    const catalog = await getCategoryCatalog(category.slug);
    if (!catalog?.items.length) continue;
    await writeJson(`${category.slug}.json`, catalog);
    written += 1;
  }

  console.log(
    `[catalog-static] OK — filters, products, ${written} gammes → public/catalog/`,
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("[catalog-static] Échec:", err);
  process.exit(1);
});
