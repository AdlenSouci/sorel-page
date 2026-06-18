import { ArrowLeft, Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCategoryCatalog, itemTitle, resolvePhotoUrl } from "../lib/api";
import { getVarianteColor, swatchNeedsBorder } from "../lib/colorMap";
import type { CatalogueItemDTO, CategoryCatalogDTO } from "../types/category";

const PLACEHOLDER = "/product-placeholder.svg";

type Sort = "defaut" | "nom" | "couleur";

export function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CategoryCatalogDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [variante, setVariante] = useState("");
  const [sort, setSort] = useState<Sort>("defaut");

  useEffect(() => {
    if (!slug) {
      setError("Catégorie invalide.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setQ("");
    setVariante("");
    setSort("defaut");
    void (async () => {
      try {
        const catalog = await fetchCategoryCatalog(slug);
        if (!cancelled) {
          setData(catalog);
          setError(null);
        }
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
  const allItems = useMemo(() => data?.items ?? [], [data]);

  const variantes = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of allItems) {
      const v = it.variante?.trim();
      if (!v) continue;
      map.set(v, (map.get(v) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([nom, count]) => ({ nom, count }))
      .sort((a, b) => b.count - a.count || a.nom.localeCompare(b.nom, "fr"));
  }, [allItems]);

  const items = useMemo(() => {
    let rows = allItems;
    if (variante) rows = rows.filter((it) => it.variante?.trim() === variante);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      rows = rows.filter(
        (it) =>
          it.libelle.toLowerCase().includes(needle) ||
          (it.variante ?? "").toLowerCase().includes(needle) ||
          (it.codeArticle ?? "").toLowerCase().includes(needle),
      );
    }
    if (sort === "nom") {
      rows = [...rows].sort((a, b) => itemTitle(a).localeCompare(itemTitle(b), "fr"));
    } else if (sort === "couleur") {
      rows = [...rows].sort((a, b) =>
        (a.variante ?? "").localeCompare(b.variante ?? "", "fr"),
      );
    }
    return rows;
  }, [allItems, variante, q, sort]);

  const hasFilter = Boolean(variante || q.trim() || sort !== "defaut");

  return (
    <div className="px-6 py-14 md:px-16 md:py-20">
      <header className="mx-auto mb-8 max-w-6xl">
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
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
          {category?.nom ?? (loading ? "Chargement…" : "Catégorie")}
        </h1>
        {category && !loading ? (
          <p className="mt-2 text-slate-600">
            {items.length} article{items.length !== 1 ? "s" : ""}
            {hasFilter ? ` sur ${allItems.length}` : ""}
          </p>
        ) : null}
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative mb-5"
            >
              <Search
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un article…"
                className="w-full rounded-lg border border-slate-200 py-2.5 pr-3 pl-9 text-sm outline-none transition focus:border-[#27E4F5] focus:ring-2 focus:ring-[#27E4F5]/20"
              />
            </form>

            <label className="mb-5 block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                Tri
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-900 outline-none focus:border-[#27E4F5] focus:ring-2 focus:ring-[#27E4F5]/20"
              >
                <option value="defaut">Par défaut</option>
                <option value="nom">Nom A → Z</option>
                <option value="couleur">Couleur</option>
              </select>
            </label>

            {variantes.length > 0 ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Couleur
                    <span className="ml-1 text-slate-400">({variantes.length})</span>
                  </span>
                  {variante ? (
                    <button
                      type="button"
                      onClick={() => setVariante("")}
                      className="text-[11px] font-medium text-[#27E4F5] hover:underline"
                    >
                      Effacer
                    </button>
                  ) : null}
                </div>
                <ul className="max-h-72 space-y-0.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
                  {variantes.map((v) => {
                    const active = variante === v.nom;
                    return (
                      <li key={v.nom}>
                        <button
                          type="button"
                          onClick={() => setVariante(active ? "" : v.nom)}
                          className={[
                            "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition",
                            active
                              ? "bg-[#27E4F5]/10 font-medium text-slate-900 ring-1 ring-[#27E4F5]/40"
                              : "text-slate-700 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <ColorSwatch name={v.nom} ring={active} />
                          <span className="min-w-0 flex-1 truncate text-[13px]">
                            {v.nom}
                          </span>
                          <span className="shrink-0 text-[10px] tabular-nums text-slate-400">
                            {v.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {hasFilter ? (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setVariante("");
                  setSort("defaut");
                }}
                className="mt-5 w-full rounded-lg border border-slate-200 py-2.5 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Réinitialiser
              </button>
            ) : null}
          </div>
        </aside>

        <section>
          {error ? (
            <p className="rounded-2xl bg-red-50 px-5 py-4 text-center text-red-900">
              {error}
            </p>
          ) : null}

          {loading ? (
            <div className="flex justify-center gap-3 py-20 text-slate-600">
              <Loader2 className="size-7 animate-spin" aria-hidden />
              <span>Chargement des articles…</span>
            </div>
          ) : null}

          {!loading && !error && allItems.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-slate-600">
              Aucun article dans cette catégorie pour le moment.
            </p>
          ) : null}

          {!loading && allItems.length > 0 && items.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-slate-600">
              Aucun article ne correspond à ce filtre.
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setVariante("");
                }}
                className="ml-2 inline-flex items-center gap-1 font-medium text-[#27E4F5] hover:underline"
              >
                <X className="size-3.5" /> Effacer
              </button>
            </div>
          ) : null}

          {!loading && items.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <ArticleCard key={item.id} item={item} />
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function ArticleCard({ item }: { item: CatalogueItemDTO }) {
  const photo = resolvePhotoUrl(item.photo);
  const [src, setSrc] = useState(photo ?? PLACEHOLDER);

  return (
    <li className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-md">
      <img
        src={src}
        alt={itemTitle(item)}
        onError={() => setSrc(PLACEHOLDER)}
        className="aspect-[4/3] w-full bg-slate-100 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-start gap-2">
          {item.variante ? <ColorSwatch name={item.variante} /> : null}
          <h2 className="text-[15px] font-semibold leading-snug text-slate-950">
            {itemTitle(item)}
          </h2>
        </div>
        {item.codeArticle ? (
          <p className="mt-1 text-sm text-slate-500">Réf. {item.codeArticle}</p>
        ) : null}
      </div>
    </li>
  );
}

function ColorSwatch({ name, ring = false }: { name: string; ring?: boolean }) {
  const hex = getVarianteColor(name);
  const border = swatchNeedsBorder(hex);
  return (
    <span
      className={[
        "mt-0.5 inline-block size-4 shrink-0 rounded-full",
        border ? "border border-slate-300" : "",
        ring ? "ring-2 ring-[#27E4F5] ring-offset-1" : "",
      ].join(" ")}
      style={{ backgroundColor: hex }}
      aria-hidden
    />
  );
}
