import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildDbSnapshot, toApiError } from "../lib/api-error.js";
import { ensureDatabaseUrl } from "../lib/database-url.js";
import {
  getCatalogFilters,
  getCatalogProducts,
  getCategories,
  getCategoryCatalog,
} from "../server/catalog-queries.js";

ensureDatabaseUrl();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const view = typeof req.query.view === "string" ? req.query.view : "";

  try {
    if (view === "filters") {
      res.status(200).json(await getCatalogFilters());
      return;
    }

    if (view === "products") {
      const sort = req.query.sort === "nom" ? "nom" : "gamme";
      res.status(200).json(
        await getCatalogProducts({
          category:
            typeof req.query.category === "string"
              ? req.query.category
              : undefined,
          q: typeof req.query.q === "string" ? req.query.q : undefined,
          variante:
            typeof req.query.variante === "string"
              ? req.query.variante
              : undefined,
          sort,
          limit: Number(req.query.limit) || 48,
        }),
      );
      return;
    }

    if (view === "items") {
      const slug = typeof req.query.slug === "string" ? req.query.slug : "";
      if (!slug) {
        res.status(400).json({ error: "Slug manquant." });
        return;
      }
      const data = await getCategoryCatalog(slug);
      if (!data) {
        res.status(404).json({ error: "Catégorie introuvable." });
        return;
      }
      res.status(200).json(data);
      return;
    }

    const limit = Number(req.query.limit) || 0;
    const featured = req.query.featured === "1";
    res.status(200).json(
      await getCategories({
        limit: limit || undefined,
        featured: featured || undefined,
      }),
    );
  } catch (e) {
    console.error(e);
    const label =
      view === "filters"
        ? "filtres"
        : view === "products"
          ? "produits"
          : view === "items"
            ? "catalogue"
            : "catégories";
    res.status(500).json({
      error: `Impossible de charger les ${label}.`,
      details: toApiError(e),
      db: buildDbSnapshot(),
    });
  }
}
