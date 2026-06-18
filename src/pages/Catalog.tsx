import { ArrowRight, Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../lib/catalog";
import type { CategoryDTO } from "../types/catalog";

export function Catalog() {
  const [categories, setCategories] = useState<CategoryDTO[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="px-6 py-14 md:px-16 md:py-20">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#27E4F5]">
          Catalogue
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Nos catégories
        </h1>
        <p className="mt-3 text-slate-600">
          Choisissez une catégorie pour voir ses articles.
        </p>
      </header>

      <div className="mx-auto max-w-6xl">
        {error ? (
          <p className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-center text-red-900">
            Impossible de charger les catégories pour le moment.
          </p>
        ) : null}

        {!categories && !error ? (
          <div className="flex justify-center py-20 text-slate-500">
            <Loader2 className="size-8 animate-spin" aria-hidden />
          </div>
        ) : null}

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogue/${encodeURIComponent(cat.slug)}`}
                className="group block"
              >
                <div className="mb-3 overflow-hidden rounded-2xl bg-white shadow-md transition-all group-hover:scale-[1.03] group-hover:shadow-xl">
                  <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 text-slate-400">
                    <ImageIcon className="size-10 opacity-55" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-center font-semibold text-slate-950">
                  {cat.nom}
                </p>
                <p className="mt-1 flex items-center justify-center gap-1 text-center text-sm text-slate-600">
                  {cat.articleCount} article{cat.articleCount > 1 ? "s" : ""}
                  <ArrowRight
                    className="size-3.5 opacity-0 transition group-hover:opacity-100"
                    aria-hidden
                  />
                </p>
              </Link>
            ))}
          </div>
        ) : null}

        {categories && categories.length === 0 && !error ? (
          <p className="py-20 text-center text-slate-600">
            Aucune catégorie disponible pour le moment.
          </p>
        ) : null}
      </div>
    </div>
  );
}
