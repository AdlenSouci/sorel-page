import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildDbSnapshot, toApiError } from "../lib/api-error.js";
import { ensureDatabaseUrl } from "../lib/database-url.js";
import { listFeaturedProducts } from "../lib/catalog.js";

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

  const limit = Math.max(1, Math.min(12, Number(req.query.limit) || 4));

  try {
    const items = await listFeaturedProducts(limit);
    res.status(200).json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Impossible de charger les articles.",
      details: toApiError(e),
      db: buildDbSnapshot(),
    });
  }
}
