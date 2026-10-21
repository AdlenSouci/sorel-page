import { ArrowLeft, X } from "@/components/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "../components/ArticleCard";
import { ArticleFilters } from "../components/ArticleFilters";
import { CardsSkeleton, ErrorMessage } from "../components/LoadState";
import { PageTitle } from "../components/PageTitle";
import { Pagination } from "../components/Pagination";
import { useSeo } from "../hooks/useSeo";
import { fetchCategoryCatalog } from "../lib/api";
import {
  FILTRES_ARTICLES_VIDES,
  filtrerArticles,
  filtresArticlesActifs,
  type FiltresArticles,
} from "../lib/articles";
import { formatVolume } from "../lib/gammes";
import type { CategoryCatalogDTO } from "../types/category";

/** Nombre d'articles par page : 4 rangées de 3. */
const PAR_PAGE = 12;

/** Articles d'une gamme (famille de forme), par pages de 12. */
export function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CategoryCatalogDTO | null>(null);
  const [error, setError] = useState<{ slug: string; message: string } | null>(null);

  const [filtres, setFiltres] = useState<FiltresArticles>(FILTRES_ARTICLES_VIDES);
  const [page, setPage] = useState(1);
  const listeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!slug) return;
    let annule = false;
    fetchCategoryCatalog(slug)
      .then((d) => {
        if (annule) return;
        setData(d);
        setError(null);
        setFiltres(FILTRES_ARTICLES_VIDES);
        setPage(1);
      })
      .catch((e: unknown) => {
        if (!annule) {
          setError({ slug, message: e instanceof Error ? e.message : "Erreur de chargement" });
        }
      });
    return () => {
      annule = true;
    };
  }, [slug]);

  const erreur = error && error.slug === slug ? error.message : null;
  const loading = !erreur && data?.category.slug !== slug;
  const courant = data && data.category.slug === slug ? data : null;
  const category = courant?.category;
  const allItems = useMemo(() => courant?.items ?? [], [courant]);

  const nbCouleurs = useMemo(
    () => new Set(allItems.map((i) => i.variante?.trim()).filter(Boolean)).size,
    [allItems],
  );
  const items = useMemo(() => filtrerArticles(allItems, filtres), [allItems, filtres]);

  const hasFilter = filtresArticlesActifs(filtres);
  const nbPages = Math.max(1, Math.ceil(items.length / PAR_PAGE));
  const pageCourante = Math.min(page, nbPages);
  const visibles = items.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);

  function changerPage(n: number) {
    setPage(n);
    const el = listeRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // tout changement de filtre ramène à la première page
  const modifier = (patch: Partial<FiltresArticles>) => {
    setFiltres((f) => ({ ...f, ...patch }));
    setPage(1);
    // la liste raccourcit : si on était plus bas, on remonte au début des résultats
    // (pas pendant la frappe ni le glissement d'un curseur : la page ne doit pas bouger sous le doigt)
    const continu = "q" in patch || "volMin" in patch || "volMax" in patch || "mesures" in patch;
    const el = listeRef.current;
    if (!continu && el && el.getBoundingClientRect().top < 100) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const reinitialiser = () => {
    setFiltres(FILTRES_ARTICLES_VIDES);
    setPage(1);
  };

  useSeo({
    title: category?.nom ? `${category.nom} — Catalogue` : "Catalogue",
    description: category?.nom
      ? `${allItems.length} références ${category.nom} : coloris disponibles, conditionnements et dimensions. Catalogue Sorel Plastiques.`
      : "Catalogue des références Sorel Plastiques.",
  });

  return (
    <div className="relative px-6 py-14 md:px-16 md:py-20">
      <div className="mx-auto mb-10 max-w-6xl">
        <div className="mb-6 flex justify-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 backdrop-blur transition hover:text-orange-700 hover:ring-orange-300"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Toutes les gammes
          </Link>
        </div>
        <PageTitle
          surtitre="Catalogue"
          titre={category?.nom ?? (loading ? "Chargement…" : "Gamme introuvable")}
        >
          {category && !loading ? (
            <>
              {category.libelles && category.libelles.length > 0 ? (
                <ul className="flex flex-wrap justify-center gap-2">
                  {category.libelles.map((l) => (
                    <li
                      key={l}
                      className="rounded-full bg-white/90 px-3.5 py-1 text-sm font-medium text-slate-800 ring-1 ring-slate-300"
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-slate-800">
                <span>
                  <strong className="text-slate-950">{items.length}</strong> article
                  {items.length !== 1 ? "s" : ""}
                  {hasFilter ? ` sur ${allItems.length}` : ""}
                </span>
                {formatVolume(category.volumeMin, category.volumeMax) ? (
                  <span>Contenance {formatVolume(category.volumeMin, category.volumeMax)}</span>
                ) : null}
                {nbCouleurs > 0 ? <span>{nbCouleurs} coloris</span> : null}
              </p>
            </>
          ) : null}
        </PageTitle>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:thin]">
          <ArticleFilters
            items={allItems}
            filtres={filtres}
            onChange={modifier}
            onReset={reinitialiser}
          />
        </aside>

        <section ref={listeRef} className="min-h-[70vh] scroll-mt-28">
          {erreur ? <ErrorMessage>{erreur}</ErrorMessage> : null}

          {loading ? (
            <CardsSkeleton count={6} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" />
          ) : null}

          {!loading && !erreur && allItems.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-slate-600">
              Aucun article dans cette gamme pour le moment.
            </p>
          ) : null}

          {!loading && allItems.length > 0 && items.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-slate-600">
              Aucun article ne correspond à ce filtre.
              <Button
                variant="cyan"
                onClick={reinitialiser}
                className="ml-2 h-auto px-0 font-medium"
              >
                <X className="size-3.5" /> Effacer
              </Button>
            </div>
          ) : null}

          {!loading && items.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-slate-700">
                Articles {(pageCourante - 1) * PAR_PAGE + 1} à{" "}
                {Math.min(pageCourante * PAR_PAGE, items.length)} sur {items.length}
              </p>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {visibles.map((item) => (
                  <ArticleCard key={item.id} item={item} />
                ))}
              </ul>
              <Pagination page={pageCourante} total={nbPages} onChange={changerPage} />
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
