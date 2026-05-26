import type { VercelRequest, VercelResponse } from "@vercel/node";
import { listCategories } from "../lib/catalog.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    res.status(200).json(await listCategories());
  } catch (e) {
    console.error("[api/categories]", e);
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    res.status(500).json({
      error: "Impossible de charger les catégories.",
      detail: process.env.NODE_ENV === "production" ? undefined : message,
    });
  }
}
