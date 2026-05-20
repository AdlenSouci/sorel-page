import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductDTO } from "../types/product";
import { getCatalogProducts } from "../lib/api";

export function Catalog() {
  const [products, setProducts] = useState<ProductDTO[] | null>(null);
  const [source, setSource] = useState<"api" | "demo" | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { source: s, products: rows } = await getCatalogProducts();
      if (cancelled) return;
      setSource(s);
      setProducts(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-6 py-14 md:px-16 md:py-24">
      <header className="mx-auto mb-14 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#27E4F5]">
          Catalogue
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          Produits disponibles
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-[1.65] text-slate-800">
          Liste affichée ici même sans base de données&nbsp;: contenu démo dans le
          code. Plus tard, la même page pourra lire vos produits depuis l&apos;API /
          Prisma lorsque tout sera branché.
        </p>
      </header>

      <div className="mx-auto max-w-7xl">
        {source === "demo" ? (
          <div className="mb-8 rounded-2xl bg-amber-50/80 px-5 py-4 text-center text-[15px] text-amber-900">
            Catalogue démo — l&apos;API n&apos;a pas répondu (normal si vous ne
            lancez pas le serveur). Les fiches sont des données locales.
          </div>
        ) : null}

        {products === null ? (
          <div className="flex items-center justify-center gap-3 text-slate-600">
            <Loader2 className="size-7 animate-spin" aria-hidden />
            <span>Chargement du catalogue…</span>
          </div>
        ) : null}

        {products?.length === 0 ? (
          <p className="text-center text-slate-600">
            Aucun produit renvoyé par l&apos;API.
          </p>
        ) : null}

        {products && products.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {products.map((p) => (
              <article
                key={p.id}
                className="flex h-full flex-col rounded-2xl bg-white/98 p-7 shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div
                  className="mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-900/5"
                  aria-hidden={p.imageUrl ? undefined : true}
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-10 opacity-55" strokeWidth={1.25} />
                  )}
                </div>
                {p.category ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
                    {p.category}
                  </p>
                ) : null}
                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                  {p.title}
                </h2>
                {p.description ? (
                  <p className="mt-3 flex-1 text-[15px] leading-[1.65] text-slate-900">
                    {p.description}
                  </p>
                ) : null}
                <p className="mt-5 truncate text-[11px] text-slate-500">
                  {p.slug}
                </p>
              </article>
            ))}
          </div>
        ) : null}

        {source === "api" ? (
          <p className="mt-12 text-center text-sm text-slate-500">
            Données servies par l&apos;API. Pour la base SQLite locale&nbsp;:{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5">npm run db:push</code>{" "}
            puis{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5">npm run db:seed</code>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
