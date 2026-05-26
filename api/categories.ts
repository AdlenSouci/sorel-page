import type { VercelRequest, VercelResponse } from "@vercel/node";
import { listCategories } from "../server/handlers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    res.status(200).json(await listCategories());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Impossible de charger les catégories." });
  }
}
