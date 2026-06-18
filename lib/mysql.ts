import mysql from "mysql2/promise";
import { ensureDatabaseUrl } from "./database-url.js";

export async function withMysql<T>(
  fn: (conn: mysql.Connection) => Promise<T>,
): Promise<T> {
  ensureDatabaseUrl();
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "Variables DB manquantes sur Vercel (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD).",
    );
  }

  const conn = await mysql.createConnection({
    uri: url,
    connectTimeout: 10_000,
  });

  try {
    return await fn(conn);
  } finally {
    await conn.end();
  }
}

export function dbErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
