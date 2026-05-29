/**
 * Prisma lit uniquement DATABASE_URL.
 * Sur Vercel / .env import, on accepte aussi DB_HOST, DB_DATABASE, etc. (format Laravel).
 */
export function ensureDatabaseUrl(): void {
  if (process.env.DATABASE_URL?.trim()) return;

  const host = process.env.DB_HOST?.trim();
  const database = process.env.DB_DATABASE?.trim();
  const username = process.env.DB_USERNAME?.trim();
  if (!host || !database || !username) return;

  const port = process.env.DB_PORT?.trim() || "3306";
  const password = process.env.DB_PASSWORD ?? "";
  const user = encodeURIComponent(username);
  const pass = encodeURIComponent(password);

  process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${database}`;
}
