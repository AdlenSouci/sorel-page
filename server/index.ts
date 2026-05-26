import "dotenv/config";
import cors from "cors";
import express from "express";
import { getCategoryCatalog, listCategories } from "../lib/catalog.js";
import { prisma } from "../lib/db.js";

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

app.get("/api/categories", async (_req, res) => {
  try {
    res.json(await listCategories());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger les catégories." });
  }
});

app.get("/api/categories/:slug/items", async (req, res) => {
  try {
    const data = await getCategoryCatalog(req.params.slug);
    if (!data) {
      res.status(404).json({ error: "Catégorie introuvable." });
      return;
    }
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger le catalogue." });
  }
});

app.listen(PORT, () => {
  console.log(`API catalogue → http://localhost:${PORT}`);
});
