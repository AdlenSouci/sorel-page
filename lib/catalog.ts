import { prisma } from "./db.js";

export async function listCategories() {
  const rows = await prisma.category.findMany({
    orderBy: [{ ordre: "asc" }, { nom: "asc" }],
    include: { _count: { select: { catalogue: true } } },
  });

  return rows.map((c) => ({
    id: c.id,
    nom: c.nom,
    slug: c.slug,
    ordre: c.ordre,
    productCount: c._count.catalogue,
  }));
}

export async function getCategoryCatalog(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;

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
