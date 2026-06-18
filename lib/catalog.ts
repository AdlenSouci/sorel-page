import { prisma } from "./db.js";

function isCleanCategory(nom: string, slug: string): boolean {
  if (slug.startsWith("categorie-")) return false;
  if (nom.startsWith("CATEGORIE-")) return false;
  if (/^\d+$/.test(nom)) return false;
  if (nom.toLowerCase().includes("test")) return false;
  if (nom === "2023864" || nom === "COUV.") return false;
  return true;
}

export async function listCategories(opts?: {
  limit?: number;
  featured?: boolean;
}) {
  const rows = await prisma.category.findMany({
    orderBy: [{ ordre: "asc" }, { nom: "asc" }],
    include: { _count: { select: { catalogue: true } } },
  });

  let list = rows
    .filter((c) => isCleanCategory(c.nom, c.slug) && c._count.catalogue > 0)
    .map((c) => ({
      id: c.id,
      nom: c.nom,
      slug: c.slug,
      ordre: c.ordre,
      articleCount: c._count.catalogue,
      productCount: c._count.catalogue,
    }));

  if (opts?.featured) {
    list = [...list].sort((a, b) => b.articleCount - a.articleCount);
  }
  if (opts?.limit) {
    list = list.slice(0, opts.limit);
  }

  return list;
}

export async function listCatalogFilters() {
  const categories = await prisma.category.findMany({
    orderBy: [{ ordre: "asc" }, { nom: "asc" }],
    include: { catalogue: { select: { libelle: true, variante: true } } },
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

export async function listCatalogProducts(opts?: {
  category?: string;
  q?: string;
  variante?: string;
  sort?: "gamme" | "nom";
  limit?: number;
}) {
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
    if (opts?.category && cat.slug !== opts.category) continue;

    const q = opts?.q?.trim().toLowerCase();
    if (q) {
      const hay = `${row.libelle} ${row.codeArticle ?? ""} ${row.variante ?? ""}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }
    if (opts?.variante && row.variante?.trim() !== opts.variante) continue;

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

  let products = [...grouped.values()].map((p) => ({
    id: p.id,
    libelle: p.libelle,
    categorieId: p.categorieId,
    categoryNom: p.categoryNom,
    categorySlug: p.categorySlug,
    photo: p.photo,
    variantes: [...p.variantes].sort((a, b) => a.localeCompare(b, "fr")),
    variantCount: p.variantes.size,
  }));

  const sort = opts?.sort === "nom" ? "nom" : "gamme";
  products.sort((a, b) => {
    if (sort === "nom") return a.libelle.localeCompare(b.libelle, "fr");
    const byGamme = a.categoryNom.localeCompare(b.categoryNom, "fr");
    return byGamme !== 0 ? byGamme : a.libelle.localeCompare(b.libelle, "fr");
  });

  const limit = Math.min(opts?.limit ?? 48, 200);
  return products.slice(0, limit);
}

export async function listFeaturedProducts(limit = 4) {
  const items = await prisma.catalogue.findMany({
    take: limit,
    orderBy: { id: "desc" },
    include: { categorie: true },
  });

  return items.map((item) => ({
    id: item.id,
    codeArticle: item.codeArticle?.trim() ?? null,
    libelle: item.libelle,
    variante: item.variante,
    photo: item.photo,
    categorySlug: item.categorie.slug,
    categoryNom: item.categorie.nom,
  }));
}

export async function getCategoryCatalog(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category || !isCleanCategory(category.nom, category.slug)) return null;

  const items = await prisma.catalogue.findMany({
    where: { categorieId: category.id },
    orderBy: [{ libelle: "asc" }, { variante: "asc" }],
  });

  return {
    category: {
      id: category.id,
      nom: category.nom,
      slug: category.slug,
      ordre: category.ordre,
    },
    items: items.map((item) => ({
      id: item.id,
      codeArticle: item.codeArticle?.trim() ?? null,
      libelle: item.libelle,
      variante: item.variante,
      photo: item.photo,
      categorySlug: category.slug,
      categoryNom: category.nom,
    })),
  };
}
