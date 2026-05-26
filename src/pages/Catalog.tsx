import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../lib/api";
import type { CategoryDTO } from "../types/category";

export function Catalog() {
  const [categories, setCategories] = useState<CategoryDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const cats = await fetchCategories();
        if (!cancelled) setCategories(cats);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erreur de chargement");
          setCategories(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
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
          Nos catégories
        </h1>
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
            <span>Chargement…</span>
          </div>
        ) : null}

        {!loading && categories?.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-white/98 p-6 shadow-lg ring-1 ring-slate-900/5"
              >
                <h2 className="text-lg font-bold text-slate-950">{c.nom}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {c.productCount ?? 0} produit(s)
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && categories?.length === 0 ? (
          <p className="text-center text-slate-600">Aucune catégorie.</p>
        ) : null}

        <p className="mt-12 text-center">
          <Link to="/" className="text-sm font-semibold text-orange-700 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
