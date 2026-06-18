import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCategoryCatalog, itemTitle, resolvePhotoUrl } from "../lib/api";
import type { CategoryCatalogDTO } from "../types/category";

export function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CategoryCatalogDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setError("Catégorie invalide.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const catalog = await fetchCategoryCatalog(slug);
        if (!cancelled) setData(catalog);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erreur de chargement");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const category = data?.category;
  const items = data?.items ?? [];

  return (
    <div className="px-6 py-14 md:px-16 md:py-24">
      <header className="mx-auto mb-10 max-w-3xl">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Toutes les catégories
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#27E4F5]">
          Catalogue
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          {category?.nom ?? (loading ? "Chargement…" : "Catégorie")}
        </h1>
        {category && !loading ? (
          <p className="mt-3 text-slate-600">
            {items.length} produit{items.length !== 1 ? "s" : ""}
          </p>
        ) : null}
      </header>

      <div className="mx-auto max-w-7xl">
        {error ? (
          <p className="rounded-2xl bg-red-50 px-5 py-4 text-center text-red-900">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex justify-center gap-3 text-slate-600">
            <Loader2 className="size-7 animate-spin" aria-hidden />
            <span>Chargement des articles…</span>
          </div>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-slate-600">
            Aucun article dans cette catégorie pour le moment.
          </p>
        ) : null}

        {!loading && items.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const photo = resolvePhotoUrl(item.photo);
              return (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white/98 shadow-lg ring-1 ring-slate-900/5"
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt=""
                      className="aspect-[4/3] w-full object-cover bg-slate-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-slate-400">
                      <Package className="size-12" strokeWidth={1.25} aria-hidden />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-slate-950">
                      {itemTitle(item)}
                    </h2>
                    {item.codeArticle ? (
                      <p className="mt-1 text-sm text-slate-500">
                        Réf. {item.codeArticle}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
