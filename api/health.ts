import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ok: true, database: "connected" });
  } catch (e) {
    console.error("[api/health]", e);
    res.status(503).json({ ok: false, error: "Base de données inaccessible." });
  }
}
