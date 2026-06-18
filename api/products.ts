import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildDbSnapshot, toApiError } from "../lib/api-error.js";
import { ensureDatabaseUrl } from "../lib/database-url.js";
import { getCatalogProducts } from "../server/catalog-queries.js";

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

  try {
    const sort = req.query.sort === "nom" ? "nom" : "gamme";
    res.status(200).json(
      await getCatalogProducts({
        category:
          typeof req.query.category === "string" ? req.query.category : undefined,
        q: typeof req.query.q === "string" ? req.query.q : undefined,
        variante:
          typeof req.query.variante === "string" ? req.query.variante : undefined,
        sort,
        limit: Number(req.query.limit) || 48,
      }),
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Impossible de charger les produits.",
      details: toApiError(e),
      db: buildDbSnapshot(),
    });
  }
}
