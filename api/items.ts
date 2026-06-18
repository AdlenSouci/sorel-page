import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildDbSnapshot, toApiError } from "../lib/api-error.js";
import { getCategoryCatalog } from "../lib/catalog.js";
import { ensureDatabaseUrl } from "../lib/database-url.js";

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

  const slug = typeof req.query.slug === "string" ? req.query.slug.trim() : "";
  if (!slug) {
    res.status(400).json({ error: "Slug manquant." });
    return;
  }

  try {
    const data = await getCategoryCatalog(slug);
    if (!data) {
      res.status(404).json({ error: "Catégorie introuvable." });
      return;
    }
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Impossible de charger les articles.",
      details: toApiError(e),
      db: buildDbSnapshot(),
    });
  }
}
