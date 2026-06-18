import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  checkDb,
  getCatalogFilters,
  getCatalogProducts,
  getCategories,
  getCategoryCatalog,
} from "./server/catalog-queries.js";

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function readQuery(url: string) {
  return new URL(url, "http://localhost");
}

async function handleLocalDb(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  if (!req.url?.startsWith("/api/")) {
    next();
    return;
  }

  const { pathname, searchParams } = readQuery(req.url);

  try {
    if (pathname === "/api/health") {
      const db = await checkDb();
      sendJson(res, 200, { ok: true, db });
      return;
    }

    if (pathname === "/api/categories") {
      const view = searchParams.get("view") ?? "";

      if (view === "filters") {
        sendJson(res, 200, await getCatalogFilters());
        return;
      }

      if (view === "products") {
        sendJson(
          res,
          200,
          await getCatalogProducts({
            category: searchParams.get("category") ?? undefined,
            q: searchParams.get("q") ?? undefined,
            variante: searchParams.get("variante") ?? undefined,
            sort:
              searchParams.get("sort") === "nom" ? "nom" : "gamme",
            limit: Number(searchParams.get("limit") || 48),
          }),
        );
        return;
      }

      if (view === "items") {
        const slug = searchParams.get("slug") ?? "";
        if (!slug) {
          sendJson(res, 400, { error: "Slug manquant." });
          return;
        }
        const data = await getCategoryCatalog(slug);
        if (!data) {
          sendJson(res, 404, { error: "Catégorie introuvable." });
          return;
        }
        sendJson(res, 200, data);
        return;
      }

      const limit = Number(searchParams.get("limit") || 0);
      const featured = searchParams.get("featured") === "1";
      const rows = await getCategories({ limit: limit || undefined, featured });
      sendJson(res, 200, rows);
      return;
    }

    if (pathname === "/api/catalog-filters") {
      sendJson(res, 200, await getCatalogFilters());
      return;
    }

    const productQuery = {
      category: searchParams.get("category") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      variante: searchParams.get("variante") ?? undefined,
      sort: (searchParams.get("sort") === "nom" ? "nom" : "gamme") as "gamme" | "nom",
      limit: Number(searchParams.get("limit") || 48),
    };

    if (pathname === "/api/products" || pathname === "/api/articles") {
      sendJson(res, 200, await getCatalogProducts(productQuery));
      return;
    }

    next();
  } catch (err) {
    console.error("[sorel_local]", err);
    sendJson(res, 500, {
      error: "Lecture MySQL impossible — vérifiez sorel_local et .env",
    });
  }
}

/** Dev local : Vite lit MySQL directement, pas de 2e serveur. */
export function localDbPlugin(): Plugin {
  return {
    name: "sorel-local-db",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleLocalDb(req, res, next);
      });
    },
  };
}
