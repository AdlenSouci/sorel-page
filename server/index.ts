import "dotenv/config";
import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.API_PORT) || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (e) {
    console.error(e);
    res.status(503).json({ ok: false, error: "Base de données inaccessible." });
  }
});

/** Toutes les catégories (table categories) */
app.get("/api/categories", async (_req, res) => {
  try {
    const rows = await prisma.category.findMany({
      orderBy: [{ ordre: "asc" }, { nom: "asc" }],
      include: { _count: { select: { catalogue: true } } },
    });

    res.json(
      rows.map((c) => ({
        id: c.id,
        nom: c.nom,
        slug: c.slug,
        ordre: c.ordre,
        productCount: c._count.catalogue,
      })),
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger les catégories." });
  }
});

/** Articles d'une catégorie (table catalogue) */
app.get("/api/categories/:slug/items", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
    });

    if (!category) {
      res.status(404).json({ error: "Catégorie introuvable." });
      return;
    }

    const items = await prisma.catalogue.findMany({
      where: { categorieId: category.id },
      orderBy: [{ libelle: "asc" }, { variante: "asc" }],
    });

    res.json({
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
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger le catalogue." });
  }
});

app.listen(PORT, () => {
  console.log(`API Sorel catalogue → http://localhost:${PORT}`);
  console.log(`Base : ${process.env.DATABASE_URL?.replace(/:[^:@/]+@/, ":***@") ?? "(DATABASE_URL manquant)"}`);
});
