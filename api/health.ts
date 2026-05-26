import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkDatabase } from "../server/handlers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    res.status(200).json(await checkDatabase());
  } catch (e) {
    console.error(e);
    res.status(503).json({ ok: false, error: "Base de données inaccessible." });
  }
}
