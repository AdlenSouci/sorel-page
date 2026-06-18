import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getCategoryCatalog,
  listCatalogFilters,
  listCatalogProducts,
  listCategories,
} from "../lib/catalog.js";
import { ensureDatabaseUrl } from "../lib/database-url.js";
import { prisma } from "../lib/db.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(root, "..", "src", "generated", "catalog-data.ts");

async function main() {
  ensureDatabaseUrl();

  const hasDb =
    Boolean(process.env.DATABASE_URL?.trim()) ||
    Boolean(process.env.DB_HOST?.trim());

  if (!hasDb) {
    await writeModule({
      buildId: "local",
      filters: { categories: [], variantes: [], totalProducts: 0 },
      products: [],
      categories: [],
      categoryCatalogs: {},
    });
    console.warn("[build-catalog] Pas de DB — catalogue vide (dev seulement).");
    return;
  }

  const categories = await listCategories();
  const filters = await listCatalogFilters();
  const products = await listCatalogProducts({ limit: 500 });

  const categoryCatalogs: Record<string, unknown> = {};
  for (const cat of categories) {
    const catalog = await getCategoryCatalog(cat.slug);
    if (catalog?.items.length) {
      categoryCatalogs[cat.slug] = catalog;
    }
  }

  await writeModule({
    buildId: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "build",
    filters,
    products,
    categories,
    categoryCatalogs,
  });

  console.log(
    `[build-catalog] OK — ${products.length} produits, ${Object.keys(categoryCatalogs).length} gammes`,
  );

  await prisma.$disconnect();
}

async function writeModule(data: {
  buildId: string;
  filters: unknown;
  products: unknown;
  categories: unknown;
  categoryCatalogs: Record<string, unknown>;
}) {
  await mkdir(path.dirname(outFile), { recursive: true });
  const body = `/* Généré par scripts/build-catalog-data.ts — ne pas modifier */\nexport const BUILD_ID = ${JSON.stringify(data.buildId)};\nexport const catalogFilters = ${JSON.stringify(data.filters)} as import("../types/catalog").CatalogFiltersDTO;\nexport const catalogProducts = ${JSON.stringify(data.products)} as import("../types/catalog").CatalogProductDTO[];\nexport const catalogCategories = ${JSON.stringify(data.categories)};\nexport const categoryCatalogs = ${JSON.stringify(data.categoryCatalogs)} as Record<string, import("../types/category").CategoryCatalogDTO>;\n`;
  await writeFile(outFile, body, "utf8");
}

main().catch(async (err) => {
  console.error("[build-catalog] Échec:", err);
  const onVercel = Boolean(process.env.VERCEL);
  if (!onVercel) {
    await writeModule({
      buildId: "local",
      filters: { categories: [], variantes: [], totalProducts: 0 },
      products: [],
      categories: [],
      categoryCatalogs: {},
    });
    console.warn("[build-catalog] Build local sans DB — catalogue vide.");
    return;
  }
  process.exit(1);
});
