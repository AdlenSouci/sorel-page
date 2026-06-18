import type { ConnectionOptions } from "mysql2/promise";

export function readSslCa(): string | undefined {
  const inline = process.env.DB_SSL_CA?.trim();
  if (inline) return inline.replace(/\\n/g, "\n");
  return undefined;
}

function hostLooksRemote(host: string): boolean {
  return (
    host.includes("aivencloud.com") ||
    host.includes("tidbcloud.com") ||
    host.includes("railway.app")
  );
}

export function needsMysqlSsl(): boolean {
  const host = process.env.DB_HOST?.trim() ?? "";
  return process.env.DB_SSL === "1" || hostLooksRemote(host);
}

export function getMysql2Ssl(): ConnectionOptions["ssl"] {
  const ca = readSslCa();
  if (ca) return { ca, rejectUnauthorized: true };
  if (needsMysqlSsl()) return { rejectUnauthorized: true };
  return undefined;
}

export function mysqlEnv() {
  return {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? process.env.DB_DATABASE ?? "sorel_local",
  };
}

export function poolOptions(): ConnectionOptions {
  const onVercel = Boolean(process.env.VERCEL);
  return {
    ...mysqlEnv(),
    waitForConnections: true,
    connectionLimit: onVercel ? 1 : 10,
    ssl: getMysql2Ssl(),
  };
}
