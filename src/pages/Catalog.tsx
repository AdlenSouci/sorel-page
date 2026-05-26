import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCategories, fetchCategoryCatalog } from "../lib/api";
import type { CatalogueItemDTO, CategoryDTO } from "../types/category";

export function Catalog() {
  const { slug } = useParams<{ slug?: string }>();
  const [categories, setCategories] = useState<CategoryDTO[] | null>(null);
  const [items, setItems] = useState<CatalogueItemDTO[] | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const cats = await fetchCategories();
        if (cancelled) return;
        setCategories(cats);

        if (slug) {
          const { category, items: rows } = await fetchCategoryCatalog(slug);
          if (cancelled) return;
          setActiveCategory(category);
          setItems(rows);
        } else {
          setActiveCategory(null);
          setItems(null);
        }
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error
            ? e.message
            : "Impossible de joindre l'API. Lancez npm run dev:full.",
        );
        setCategories(null);
        setItems(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="px-6 py-14 md:px-16 md:py-24">
      <header className="mx-auto mb-14 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#27E4F5]">
          Catalogue
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          {activeCategory ? activeCategory.nom : "Nos catégories"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-[1.65] text-slate-800">
          {activeCategory
            ? `${items?.length ?? 0} article(s) dans cette catégorie.`
            : "Choisissez une catégorie pour afficher les produits (base sorel_local)."}
        </p>
      </header>

      <div className="mx-auto max-w-7xl">
        {slug ? (
          <Link
            to="/catalogue"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Toutes les catégories
          </Link>
        ) : null}

        {error ? (
          <div className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-center text-[15px] text-red-900">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-slate-600">
            <Loader2 className="size-7 animate-spin" aria-hidden />
            <span>Chargement…</span>
          </div>
        ) : null}

        {!loading && !slug && categories?.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/catalogue/${c.slug}`}
                className="flex flex-col rounded-2xl bg-white/98 p-6 shadow-lg ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <h2 className="text-lg font-bold text-slate-950">{c.nom}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {c.productCount ?? 0} produit(s)
                </p>
              </Link>
            ))}
          </div>
        ) : null}

        {!loading && !slug && categories?.length === 0 ? (
          <p className="text-center text-slate-600">
            Aucune catégorie dans la table <code>categories</code>.
          </p>
        ) : null}

        {!loading && slug && items?.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {items.map((p) => (
              <article
                key={p.id}
                className="flex h-full flex-col rounded-2xl bg-white/98 p-7 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-900/5">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.libelle}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-10 opacity-55" strokeWidth={1.25} />
                  )}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                  {p.libelle}
                </h2>
                {p.variante ? (
                  <p className="mt-2 text-[15px] text-slate-700">{p.variante}</p>
                ) : null}
                {p.codeArticle ? (
                  <p className="mt-4 truncate text-[11px] text-slate-500">
                    {p.codeArticle}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {!loading && slug && items?.length === 0 ? (
          <p className="text-center text-slate-600">
            Aucun article dans cette catégorie.
          </p>
        ) : null}
      </div>
    </div>
  );
}
