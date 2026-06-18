import {
  Image as ImageIcon,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import { getVarianteColor, swatchNeedsBorder } from "../lib/colorMap";
import { fetchCatalogFilters, fetchCatalogProducts } from "../lib/catalog";
import type {
  ArticleSort,
  CatalogFiltersDTO,
  CatalogProductDTO,
  VarianteFilterDTO,
} from "../types/catalog";

const PAGE_SIZE = 48;
const MAX_COLORS_ON_CARD = 8;

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") ?? "";
  const variante = searchParams.get("variante") ?? "";
  const sort = (searchParams.get("sort") as ArticleSort) || "gamme";
  const qParam = searchParams.get("q") ?? "";

  const [q, setQ] = useState(qParam);
  const [filters, setFilters] = useState<CatalogFiltersDTO | null>(null);
  const [products, setProducts] = useState<CatalogProductDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  useEffect(() => {
    fetchCatalogFilters()
      .then(setFilters)
      .catch(() => setFilters(null))
      .finally(() => setLoadingFilters(false));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      setProducts(
        await fetchCatalogProducts({
          category: categorySlug || undefined,
          q: qParam.trim() || undefined,
          variante: variante || undefined,
          sort,
          limit: PAGE_SIZE,
        }),
      );
    } catch {
      setError("Impossible de charger le catalogue.");
      setProducts(null);
    } finally {
      setLoadingProducts(false);
    }
  }, [categorySlug, qParam, variante, sort]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const patchParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    patchParams({ q: q.trim() || null });
    setMobileOpen(false);
  };

  const resetFilters = () => {
    setQ("");
    setSearchParams({}, { replace: true });
    setMobileOpen(false);
  };

  const activeGamme = filters?.categories.find((c) => c.slug === categorySlug);

  const activeCount = useMemo(
    () =>
      [categorySlug, variante, qParam.trim(), sort !== "gamme" ? sort : ""].filter(
        Boolean,
      ).length,
    [categorySlug, variante, qParam, sort],
  );

  const sidebar = loadingFilters ? (
    <div className="flex justify-center py-12">
      <Loader2 className="size-5 animate-spin text-slate-400" />
    </div>
  ) : filters ? (
    <CatalogSidebar
      filters={filters}
      q={q}
      setQ={setQ}
      categorySlug={categorySlug}
      variante={variante}
      sort={sort}
      onSearch={onSearch}
      onCategory={(v) => patchParams({ category: v || null })}
      onVariante={(v) => patchParams({ variante: v || null })}
      onSort={(s) => patchParams({ sort: s === "gamme" ? null : s })}
      onReset={resetFilters}
    />
  ) : (
    <p className="text-sm text-slate-500">Filtres indisponibles.</p>
  );

  return (
    <div className="px-4 py-12 sm:px-6 md:px-10 md:py-14 lg:px-12">
      <header className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#27E4F5]">
          Catalogue
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Nos produits
        </h1>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[268px_minmax(0,1fr)] lg:gap-10">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtres
          {activeCount > 0 ? (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs text-white">
              {activeCount}
            </span>
          ) : null}
        </button>

        {mobileOpen ? (
          <div className="fixed inset-0 z-[300] lg:hidden">
            <button
              type="button"
              aria-label="Fermer"
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-[min(100vw-2rem,320px)] flex-col bg-white shadow-xl">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
                <span className="font-semibold text-slate-900">Filtres</span>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Fermer">
                  <X className="size-5 text-slate-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">{sidebar}</div>
            </aside>
          </div>
        ) : null}

        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-xl bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Affiner
            </p>
            {sidebar}
          </div>
        </aside>

        <section>
          {error ? (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          {activeCount > 0 ? (
            <ActiveFilters
              q={qParam.trim()}
              gamme={activeGamme?.nom}
              variante={variante}
              onClearQ={() => patchParams({ q: null })}
              onClearGamme={() => patchParams({ category: null })}
              onClearVariante={() => patchParams({ variante: null })}
              onClearAll={resetFilters}
            />
          ) : null}

          <div className="mb-5 flex items-baseline justify-between gap-4">
            <p className="text-sm text-slate-600">
              {loadingProducts
                ? "Chargement…"
                : `${products?.length ?? 0} produit${(products?.length ?? 0) > 1 ? "s" : ""}`}
            </p>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-6 animate-spin text-slate-400" />
            </div>
          ) : null}

          {!loadingProducts && products?.length === 0 ? (
            <p className="py-20 text-center text-slate-600">Aucun produit trouvé.</p>
          ) : null}

          {!loadingProducts && products && products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={`${p.categorieId}-${p.libelle}`}
                  product={p}
                  highlightColor={variante}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function CatalogSidebar({
  filters,
  q,
  setQ,
  categorySlug,
  variante,
  sort,
  onSearch,
  onCategory,
  onVariante,
  onSort,
  onReset,
}: {
  filters: CatalogFiltersDTO;
  q: string;
  setQ: (v: string) => void;
  categorySlug: string;
  variante: string;
  sort: ArticleSort;
  onSearch: (e: FormEvent) => void;
  onCategory: (v: string) => void;
  onVariante: (v: string) => void;
  onSort: (s: ArticleSort) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5">
      <form onSubmit={onSearch} className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un produit…"
          className="w-full rounded-lg border border-slate-200 py-2.5 pr-3 pl-9 text-sm outline-none transition focus:border-[#27E4F5] focus:ring-2 focus:ring-[#27E4F5]/20"
        />
      </form>

      <SidebarSelect
        label="Gamme"
        value={categorySlug}
        onChange={onCategory}
        options={[
          { value: "", label: `Toutes les gammes (${filters.totalProducts})` },
          ...filters.categories.map((c) => ({
            value: c.slug,
            label: `${c.nom} (${c.articleCount})`,
          })),
        ]}
      />

      <ColorFilter
        variantes={filters.variantes}
        selected={variante}
        onSelect={onVariante}
      />

      <SidebarSelect
        label="Tri"
        value={sort}
        onChange={(v) => onSort(v as ArticleSort)}
        options={[
          { value: "gamme", label: "Par gamme" },
          { value: "nom", label: "Nom A → Z" },
        ]}
      />

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-lg border border-slate-200 py-2.5 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Réinitialiser
      </button>
    </div>
  );
}

function ColorFilter({
  variantes,
  selected,
  onSelect,
}: {
  variantes: VarianteFilterDTO[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const [colorQ, setColorQ] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const needle = colorQ.trim().toLowerCase();
    if (!needle) return variantes;
    return variantes.filter((v) => v.nom.toLowerCase().includes(needle));
  }, [variantes, colorQ]);

  const visible = showAll || colorQ.trim() ? filtered : filtered.slice(0, 14);
  const hiddenCount = filtered.length - visible.length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          Couleur
          <span className="ml-1 text-slate-400">({variantes.length})</span>
        </span>
        {selected ? (
          <button
            type="button"
            onClick={() => onSelect("")}
            className="text-[11px] font-medium text-[#27E4F5] hover:underline"
          >
            Effacer
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onSelect("")}
        className={[
          "mb-2 flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-sm transition",
          !selected
            ? "border-[#27E4F5] bg-[#27E4F5]/8 font-medium text-slate-900"
            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
        ].join(" ")}
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-[9px] text-slate-400">
          ∅
        </span>
        Toutes les couleurs
      </button>

      <div className="relative mb-2">
        <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="search"
          value={colorQ}
          onChange={(e) => setColorQ(e.target.value)}
          placeholder="Chercher une couleur…"
          className="w-full rounded-lg border border-slate-200 py-2 pr-2 pl-8 text-xs outline-none focus:border-[#27E4F5] focus:ring-1 focus:ring-[#27E4F5]"
        />
      </div>

      <ul className="max-h-52 space-y-0.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        {visible.map((v) => (
          <ColorFilterRow
            key={v.nom}
            nom={v.nom}
            count={v.count}
            active={selected === v.nom}
            onClick={() => onSelect(selected === v.nom ? "" : v.nom)}
          />
        ))}
        {filtered.length === 0 ? (
          <li className="py-4 text-center text-xs text-slate-400">Aucune couleur trouvée</li>
        ) : null}
      </ul>

      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-2 w-full text-center text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          + {hiddenCount} couleur{hiddenCount > 1 ? "s" : ""}
        </button>
      ) : null}
      {showAll && !colorQ.trim() && filtered.length > 14 ? (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mt-2 w-full text-center text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          Voir moins
        </button>
      ) : null}
    </div>
  );
}

function ColorFilterRow({
  nom,
  count,
  active,
  onClick,
}: {
  nom: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        title={`${nom} — ${count} produit${count > 1 ? "s" : ""}`}
        className={[
          "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition",
          active
            ? "bg-[#27E4F5]/10 font-medium text-slate-900 ring-1 ring-[#27E4F5]/40"
            : "text-slate-700 hover:bg-slate-50",
        ].join(" ")}
      >
        <ColorSwatch name={nom} size="md" ring={active} />
        <span className="min-w-0 flex-1 truncate text-[13px]">{nom}</span>
        <span className="shrink-0 text-[10px] tabular-nums text-slate-400">{count}</span>
      </button>
    </li>
  );
}

function ColorSwatch({
  name,
  size = "sm",
  ring = false,
}: {
  name: string;
  size?: "sm" | "md";
  ring?: boolean;
}) {
  const hex = getVarianteColor(name);
  const border = swatchNeedsBorder(hex);
  const dim = size === "md" ? "size-5" : "size-3.5";

  return (
    <span
      className={[
        "inline-block shrink-0 rounded-full",
        dim,
        border ? "border border-slate-200" : "",
        ring ? "ring-2 ring-[#27E4F5] ring-offset-1" : "",
      ].join(" ")}
      style={{ backgroundColor: hex }}
      aria-hidden
    />
  );
}

function ActiveFilters({
  q,
  gamme,
  variante,
  onClearQ,
  onClearGamme,
  onClearVariante,
  onClearAll,
}: {
  q: string;
  gamme?: string;
  variante: string;
  onClearQ: () => void;
  onClearGamme: () => void;
  onClearVariante: () => void;
  onClearAll: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {gamme ? (
        <FilterChip label={gamme} onRemove={onClearGamme} />
      ) : null}
      {variante ? (
        <FilterChip
          label={variante}
          onRemove={onClearVariante}
          swatch={variante}
        />
      ) : null}
      {q ? <FilterChip label={`« ${q} »`} onRemove={onClearQ} /> : null}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-slate-500 underline hover:text-slate-800"
      >
        Tout effacer
      </button>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
  swatch,
}: {
  label: string;
  onRemove: () => void;
  swatch?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-medium text-slate-800">
      {swatch ? <ColorSwatch name={swatch} size="sm" /> : null}
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        aria-label={`Retirer ${label}`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

function SidebarSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-900 outline-none focus:border-[#27E4F5] focus:ring-2 focus:ring-[#27E4F5]/20"
      >
        {options.map((o) => (
          <option key={o.value || "__all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProductCard({
  product,
  highlightColor,
}: {
  product: CatalogProductDTO;
  highlightColor: string;
}) {
  const sorted = useMemo(() => {
    if (!highlightColor) return product.variantes;
    const rest = product.variantes.filter((v) => v !== highlightColor);
    return product.variantes.includes(highlightColor)
      ? [highlightColor, ...rest]
      : product.variantes;
  }, [product.variantes, highlightColor]);

  const shown = sorted.slice(0, MAX_COLORS_ON_CARD);
  const rest = sorted.length - shown.length;

  return (
    <article className="flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-lg bg-slate-50 text-slate-300">
        <ImageIcon className="size-8" strokeWidth={1.25} />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {product.categoryNom}
      </p>
      <h2 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
        {product.libelle}
      </h2>
      {product.variantes.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {shown.map((v) => {
            const active = v === highlightColor;
            return (
              <span
                key={v}
                title={v}
                className={[
                  "inline-flex items-center gap-1 rounded-full py-0.5 pl-0.5 pr-2 text-[10px] font-medium",
                  active
                    ? "bg-[#27E4F5]/15 text-slate-900 ring-1 ring-[#27E4F5]/50"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                <ColorSwatch name={v} size="sm" ring={active} />
                <span className="max-w-[4.5rem] truncate">{v}</span>
              </span>
            );
          })}
          {rest > 0 ? (
            <span className="text-[10px] font-medium text-slate-400">+{rest}</span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
