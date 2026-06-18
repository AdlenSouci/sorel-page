import mysql from "mysql2/promise";
import { ensureDatabaseUrl } from "./database-url.js";
import { getMysql2Ssl, mysqlEnv } from "./mysql-ssl.js";

export async function withMysql<T>(
  fn: (conn: mysql.Connection) => Promise<T>,
): Promise<T> {
  ensureDatabaseUrl();

  const conn = process.env.DATABASE_URL?.trim()
    ? await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        connectTimeout: 10_000,
        ssl: getMysql2Ssl(),
      })
    : await mysql.createConnection({
        ...mysqlEnv(),
        connectTimeout: 10_000,
        ssl: getMysql2Ssl(),
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
