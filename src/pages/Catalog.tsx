import { Search } from "@/components/icons";
import { useEffect, useMemo, useState } from "react";
import { GammeCard } from "../components/GammeCard";
import { PageTitle } from "../components/PageTitle";
import { CardsSkeleton, ErrorMessage } from "../components/LoadState";
import { useSeo } from "../hooks/useSeo";
import { fetchCategories } from "../lib/api";
import { FILTRES_VIDES, GROUPES, filtrerGammes, groupeDe } from "../lib/gammes";
import type { CategoryDTO } from "../types/catalog";

/** Page d'arrivée du catalogue : les gammes, rangées par rayon. Un clic ouvre ses articles. */
export function Catalog() {
  const [categories, setCategories] = useState<CategoryDTO[] | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [rayon, setRayon] = useState("");

  useSeo({
    title: "Catalogue — gammes et références",
    description:
      "Parcourez les gammes Sorel Plastiques : moules ronds et rectangulaires, plats, boîtes, couvercles. Plus de 200 modèles standards, coloris au choix.",
  });

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError(true));
  }, []);

  const total = useMemo(
    () => (categories ?? []).reduce((sum, c) => sum + c.articleCount, 0),
    [categories],
  );
  const visibles = useMemo(
    () => filtrerGammes(categories ?? [], { ...FILTRES_VIDES, q, groupe: rayon }),
    [categories, q, rayon],
  );
  const rayons = GROUPES.map((g) => ({
    ...g,
    gammes: visibles.filter((c) => groupeDe(c.slug).id === g.id),
  })).filter((g) => g.gammes.length > 0);

  return (
    <div className="relative px-6 py-14 md:px-16 md:py-20">
      <div className="mb-10">
        <PageTitle surtitre="Catalogue" titre="Nos gammes">
          <p>
            Choisissez une gamme pour voir ses articles.
            {categories ? (
              <span className="ml-1 font-semibold text-slate-950">
                {categories.length} gammes, {total} références.
              </span>
            ) : null}
          </p>
        </PageTitle>
      </div>

      <div className="mx-auto max-w-6xl">
        {error ? (
          <ErrorMessage className="mb-8">Impossible de charger les gammes pour le moment.</ErrorMessage>
        ) : null}

        {!categories && !error ? (
          <CardsSkeleton count={6} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" />
        ) : null}

        {categories ? (
          <>
            {/* filtre : une recherche et le choix du rayon, rien de plus */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
              <label className="relative block w-full sm:w-72">
                <span className="sr-only">Rechercher une gamme</span>
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-500"
                  aria-hidden
                />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher une gamme"
                  className="h-10 w-full rounded-full border border-slate-300 bg-white pr-4 pl-10 text-sm outline-none transition placeholder:text-slate-500 focus:border-orange-400"
                />
              </label>
              <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Rayon">
                {[{ id: "", court: "Toutes" }, ...GROUPES].map((r) => {
                  const on = rayon === r.id;
                  return (
                    <button
                      key={r.id || "toutes"}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setRayon(r.id)}
                      className={`h-10 rounded-full border px-4 text-sm font-semibold transition-colors duration-200 ${
                        on
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-300 bg-white text-slate-800 hover:border-orange-300"
                      }`}
                    >
                      {r.court}
                    </button>
                  );
                })}
              </div>
            </div>

            {rayons.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-400 bg-white/80 py-14 text-center text-slate-800">
                Aucune gamme ne correspond.
              </p>
            ) : null}

            <div className="space-y-12">
              {rayons.map((g) => (
                <section key={g.id} aria-labelledby={`rayon-${g.id}`}>
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-slate-300 pb-3">
                    <h2
                      id={`rayon-${g.id}`}
                      className="text-xl font-semibold tracking-tight text-slate-950"
                    >
                      {g.titre}
                    </h2>
                    <p className="text-sm font-semibold text-slate-900 md:text-base">{g.intro}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {g.gammes.map((c, i) => (
                      <GammeCard key={c.slug} category={c} index={i} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
