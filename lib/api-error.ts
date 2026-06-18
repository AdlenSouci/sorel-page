type DbSnapshot = {
  databaseUrlPresent: boolean;
  dbHostPresent: boolean;
  dbPortPresent: boolean;
  dbDatabasePresent: boolean;
  dbUsernamePresent: boolean;
  databaseHost: string | null;
  databasePort: string | null;
  databaseName: string | null;
};

function safeParseDatabaseUrl(rawUrl: string | undefined): {
  host: string | null;
  port: string | null;
  database: string | null;
} {
  if (!rawUrl?.trim()) {
    return { host: null, port: null, database: null };
  }

  try {
    const url = new URL(rawUrl);
    const dbPath = url.pathname.replace(/^\//, "");
    return {
      host: url.hostname || null,
      port: url.port || null,
      database: dbPath || null,
    };
  } catch {
    return { host: null, port: null, database: null };
  }
}

export function buildDbSnapshot(): DbSnapshot {
  const parsed = safeParseDatabaseUrl(process.env.DATABASE_URL);
  return {
    databaseUrlPresent: Boolean(process.env.DATABASE_URL?.trim()),
    dbHostPresent: Boolean(process.env.DB_HOST?.trim()),
    dbPortPresent: Boolean(process.env.DB_PORT?.trim()),
    dbDatabasePresent: Boolean(process.env.DB_DATABASE?.trim()),
    dbUsernamePresent: Boolean(process.env.DB_USERNAME?.trim()),
    databaseHost: parsed.host,
    databasePort: parsed.port,
    databaseName: parsed.database,
  };
}

export function toApiError(error: unknown) {
  const e = error as {
    name?: string;
    message?: string;
    code?: string;
    meta?: unknown;
  };

  return {
    name: e?.name ?? "UnknownError",
    message: e?.message ?? "Erreur inconnue",
    code: e?.code ?? null,
    meta: e?.meta ?? null,
  };
}
