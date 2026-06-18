/**
 * Prisma lit uniquement DATABASE_URL.
 * Sur Vercel / .env import, on accepte aussi DB_HOST, DB_DATABASE, etc. (format Laravel).
 *
 * Aiven utilise un certificat auto-signé : on demande à Prisma d'accepter
 * la connexion TLS sans vérifier la chaîne (sslaccept=accept_invalid_certs).
 */
const AIVEN_SSL = "sslaccept=accept_invalid_certs";

function needsAivenSsl(url: string): boolean {
  return url.includes("aivencloud.com") || process.env.DB_SSL === "1";
}

export function ensureDatabaseUrl(): void {
  const existing = process.env.DATABASE_URL?.trim();
  if (existing) {
    if (!needsAivenSsl(existing)) return;

    let url = existing.replace(/sslaccept=strict/gi, AIVEN_SSL);
    if (!url.includes("sslaccept=")) {
      url += (url.includes("?") ? "&" : "?") + AIVEN_SSL;
    }
    process.env.DATABASE_URL = url;
    return;
  }

  const host = process.env.DB_HOST?.trim();
  const database = process.env.DB_NAME?.trim() || process.env.DB_DATABASE?.trim();
  const username = process.env.DB_USER?.trim() || process.env.DB_USERNAME?.trim();
  if (!host || !database || !username) return;

  const port = process.env.DB_PORT?.trim() || "3306";
  const password = process.env.DB_PASSWORD ?? "";
  const user = encodeURIComponent(username);
  const pass = encodeURIComponent(password);

  const ssl =
    host.includes("aivencloud.com") || process.env.DB_SSL === "1"
      ? `?${AIVEN_SSL}`
      : "";

  process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${database}${ssl}`;
}
