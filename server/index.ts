import "dotenv/config";
import express from "express";
import {
  checkDb,
  getCatalogFilters,
  getCatalogProducts,
  getCategories,
} from "./catalog-queries.js";

const app = express();
const PORT = Number(process.env.API_PORT) || 3001;

app.get("/api/health", async (_req, res) => {
  try {
    const db = await checkDb();
    res.json({ ok: true, db });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    res.json(await getCategories({
      limit: Number(req.query.limit) || undefined,
      featured: req.query.featured === "1",
    }));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger les catégories." });
  }
});

app.get("/api/catalog-filters", async (_req, res) => {
  try {
    res.json(await getCatalogFilters());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger les filtres." });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    res.json(
      await getCatalogProducts({
        category:
          typeof req.query.category === "string" ? req.query.category : undefined,
        q: typeof req.query.q === "string" ? req.query.q : undefined,
        variante:
          typeof req.query.variante === "string" ? req.query.variante : undefined,
        sort: req.query.sort === "nom" ? "nom" : "gamme",
        limit: Number(req.query.limit) || 48,
      }),
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger les produits." });
  }
});

app.get("/api/articles", async (req, res) => {
  try {
    res.json(
      await getCatalogProducts({
        category:
          typeof req.query.category === "string" ? req.query.category : undefined,
        q: typeof req.query.q === "string" ? req.query.q : undefined,
        variante:
          typeof req.query.variante === "string" ? req.query.variante : undefined,
        sort: req.query.sort === "nom" ? "nom" : "gamme",
        limit: Number(req.query.limit) || 48,
      }),
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger les articles." });
  }
});

app.listen(PORT, () => {
  console.log(`MySQL ${process.env.DB_NAME ?? "sorel_local"} → :${PORT}`);
});
