import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildDbSnapshot, toApiError } from "../lib/api-error.js";
import { ensureDatabaseUrl } from "../lib/database-url.js";
import { prisma } from "../lib/db.js";

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
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      ok: true,
      database: "connected",
      db: buildDbSnapshot(),
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      database: "disconnected",
      details: toApiError(error),
      db: buildDbSnapshot(),
    });
  }
}
