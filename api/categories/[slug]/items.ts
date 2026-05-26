import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCategoryCatalog } from "../../../server/handlers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const slug = req.query.slug;
  if (typeof slug !== "string" || !slug) {
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
    res.status(500).json({ error: "Impossible de charger le catalogue." });
  }
}
