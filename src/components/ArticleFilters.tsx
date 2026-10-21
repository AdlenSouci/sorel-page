import { Search } from "@/components/icons";
import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  FORMES,
  formatMl,
  MESURES,
  mesure,
  OPTIONS,
  filtresArticlesActifs,
  type CleBool,
  type CleMesure,
  type FiltresArticles,
  type GroupeOption,
  type TriArticles,
} from "../lib/articles";
import type { CatalogueItemDTO } from "../types/category";
import { ColorSwatch } from "./ColorSwatch";

const PAS = 50;

/** Une ligne de filtre : case à cocher, libellé, nombre d'articles. Grisée quand aucun article ne convient. */
function Ligne({
  coche,
  onChange,
  nombre,
  children,
}: {
  coche: boolean;
  onChange: () => void;
  nombre: number;
  children: React.ReactNode;
}) {
  const vide = nombre === 0 && !coche;
  return (
    <label
      className={`flex items-center gap-3 rounded-md px-1 py-1.5 text-sm transition-colors ${
        vide ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-800 hover:bg-slate-50"
      }`}
    >
      <Checkbox checked={coche} disabled={vide} onCheckedChange={onChange} />
      <span className="flex min-w-0 flex-1 items-center gap-2 truncate">{children}</span>
      <span className="text-xs tabular-nums text-slate-500">{nombre}</span>
    </label>
  );
}

/** Une plage réglable (conditionnement, longueur…) : curseur à deux poignées et valeurs aux extrémités. */
function PlageMesure({
  libelle,
  borne,
  pas,
  unite,
  valeur,
  onChange,
}: {
  libelle: string;
  borne: { min: number; max: number };
  pas: number;
  unite: string;
  valeur: { min: number | null; max: number | null };
  onChange: (v: { min: number | null; max: number | null }) => void;
}) {
  const lo = valeur.min ?? borne.min;
  const hi = valeur.max ?? borne.max;
  const fmt = (v: number) => `${v.toLocaleString("fr-FR")}${unite}`;
  return (
    <div className="px-1 pt-1 pb-2">
      <p className="mb-2 text-xs font-semibold text-slate-700">{libelle}</p>
      <Slider
        min={borne.min}
        max={borne.max}
        step={pas}
        minStepsBetweenThumbs={1}
        value={[lo, hi]}
        onValueChange={([a, b]) =>
          onChange({ min: a <= borne.min ? null : a, max: b >= borne.max ? null : b })
        }
        aria-label={libelle}
      />
      <p className="mt-2 flex justify-between text-xs font-semibold text-slate-800 tabular-nums">
        <span>{fmt(lo)}</span>
        <span>{fmt(hi)}</span>
      </p>
    </div>
  );
}

/**
 * Colonne de filtres d'une gamme, avec les mêmes rubriques que l'ancien site : contenance,
 * process, format, couleur, autres. Tout vient de la base ; une option qu'aucun article de la
 * gamme n'a reste affichée, grisée.
 */
export function ArticleFilters({
  items,
  filtres,
  onChange,
  onReset,
}: {
  items: CatalogueItemDTO[];
  filtres: FiltresArticles;
  onChange: (patch: Partial<FiltresArticles>) => void;
  onReset: () => void;
}) {
  const facettes = useMemo(() => {
    const volumes = items.map((i) => i.contenance).filter((v): v is number => Boolean(v));
    const couleurs = new Map<string, number>();
    const formes = new Map<string, number>();
    const gammes = new Map<string, number>();
    for (const it of items) {
      const c = it.variante?.trim();
      if (c) couleurs.set(c, (couleurs.get(c) ?? 0) + 1);
      if (it.forme) formes.set(it.forme, (formes.get(it.forme) ?? 0) + 1);
      if (it.gamme) gammes.set(it.gamme, (gammes.get(it.gamme) ?? 0) + 1);
    }
    return {
      vMin: volumes.length ? Math.floor(Math.min(...volumes) / PAS) * PAS : 0,
      vMax: volumes.length ? Math.ceil(Math.max(...volumes) / PAS) * PAS : 0,
      couleurs: [...couleurs.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr")),
      formes: Object.keys(FORMES).map((f) => [f, formes.get(f) ?? 0] as const),
      gammes: [...gammes.entries()].sort((a, b) => a[0].localeCompare(b[0], "fr")),
      options: OPTIONS.map((o) => ({ ...o, n: items.filter((i) => i[o.cle] === true).length })),
      // bornes de chaque mesure (null = la base ne varie pas assez pour un curseur)
      bornes: Object.fromEntries(
        MESURES.map((m) => {
          const vals = items.map((i) => mesure(i, m.cle)).filter((v): v is number => v !== null);
          const min = vals.length ? Math.floor(Math.min(...vals) / m.pas) * m.pas : 0;
          const max = vals.length ? Math.ceil(Math.max(...vals) / m.pas) * m.pas : 0;
          return [m.cle, max - min >= m.pas * 2 ? { min, max } : null];
        }),
      ) as Record<CleMesure, { min: number; max: number } | null>,
    };
  }, [items]);

  const lo = filtres.volMin ?? facettes.vMin;
  const hi = filtres.volMax ?? facettes.vMax;
  const curseur = facettes.vMax - facettes.vMin >= PAS * 2;

  const basculer = (cle: CleBool) =>
    onChange({
      options: filtres.options.includes(cle)
        ? filtres.options.filter((o) => o !== cle)
        : [...filtres.options, cle],
    });

  const lignesOptions = (groupe: GroupeOption) =>
    facettes.options
      .filter((o) => o.groupe === groupe)
      .map((o) => (
        <Ligne
          key={o.cle}
          coche={filtres.options.includes(o.cle)}
          onChange={() => basculer(o.cle)}
          nombre={o.n}
        >
          {o.label}
        </Ligne>
      ));

  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm ring-0">
      <label className="relative block">
        <span className="sr-only">Rechercher un article</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
        <input
          type="search"
          value={filtres.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Rechercher un article"
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm outline-none transition placeholder:text-slate-500 focus:border-orange-400"
        />
      </label>

      <div className="mt-3">
        <Select value={filtres.tri} onValueChange={(v) => onChange({ tri: v as TriArticles })}>
          <SelectTrigger aria-label="Trier par" className="h-10 w-full rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="defaut">Trier : par défaut</SelectItem>
            <SelectItem value="nom">Trier : nom A → Z</SelectItem>
            <SelectItem value="contenance">Trier : contenance croissante</SelectItem>
            <SelectItem value="couleur">Trier : couleur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["contenance", "dimensions", "conditionnement", "process", "format", "couleur", "autres"]}
        className="mt-3"
      >
        {curseur ? (
          <AccordionItem value="contenance">
            <AccordionTrigger>Contenance</AccordionTrigger>
            <AccordionContent>
              <div className="px-1 pt-1">
                <Slider
                  min={facettes.vMin}
                  max={facettes.vMax}
                  step={PAS}
                  minStepsBetweenThumbs={1}
                  value={[lo, hi]}
                  onValueChange={([a, b]) =>
                    onChange({
                      volMin: a <= facettes.vMin ? null : a,
                      volMax: b >= facettes.vMax ? null : b,
                    })
                  }
                  aria-label="Contenance"
                />
                <p className="mt-3 flex justify-between text-xs font-semibold text-slate-800 tabular-nums">
                  <span>{formatMl(lo)}</span>
                  <span>{formatMl(hi)}</span>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {(["longueur", "largeur", "hauteur"] as const).some((c) => facettes.bornes[c]) ? (
          <AccordionItem value="dimensions">
            <AccordionTrigger>Dimensions</AccordionTrigger>
            <AccordionContent>
              {MESURES.filter((m) => m.cle !== "conditionnement").map((m) => {
                const borne = facettes.bornes[m.cle];
                return borne ? (
                  <PlageMesure
                    key={m.cle}
                    libelle={m.label}
                    borne={borne}
                    pas={m.pas}
                    unite={m.unite}
                    valeur={filtres.mesures[m.cle]}
                    onChange={(v) => onChange({ mesures: { ...filtres.mesures, [m.cle]: v } })}
                  />
                ) : null;
              })}
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {facettes.bornes.conditionnement ? (
          <AccordionItem value="conditionnement">
            <AccordionTrigger>Conditionnement</AccordionTrigger>
            <AccordionContent>
              <PlageMesure
                libelle="Pièces par carton"
                borne={facettes.bornes.conditionnement}
                pas={MESURES[0].pas}
                unite=""
                valeur={filtres.mesures.conditionnement}
                onChange={(v) =>
                  onChange({ mesures: { ...filtres.mesures, conditionnement: v } })
                }
              />
            </AccordionContent>
          </AccordionItem>
        ) : null}

        <AccordionItem value="process">
          <AccordionTrigger>Process</AccordionTrigger>
          <AccordionContent>{lignesOptions("process")}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="format">
          <AccordionTrigger>Format</AccordionTrigger>
          <AccordionContent>
            {facettes.formes.map(([f, n]) => (
              <Ligne
                key={f}
                coche={filtres.forme === f}
                onChange={() => onChange({ forme: filtres.forme === f ? "" : f })}
                nombre={n}
              >
                {FORMES[f] ?? f}
              </Ligne>
            ))}
            {lignesOptions("format")}
          </AccordionContent>
        </AccordionItem>

        {facettes.couleurs.length > 0 ? (
          <AccordionItem value="couleur">
            <AccordionTrigger>Couleur</AccordionTrigger>
            <AccordionContent>
              {facettes.couleurs.map(([c, n]) => (
                <Ligne
                  key={c}
                  coche={filtres.couleur === c}
                  onChange={() => onChange({ couleur: filtres.couleur === c ? "" : c })}
                  nombre={n}
                >
                  <ColorSwatch name={c} className="size-4" />
                  {c.replace(/_/g, " ")}
                </Ligne>
              ))}
            </AccordionContent>
          </AccordionItem>
        ) : null}

        <AccordionItem value="autres">
          <AccordionTrigger>Autres</AccordionTrigger>
          <AccordionContent>{lignesOptions("autres")}</AccordionContent>
        </AccordionItem>

        {facettes.gammes.length > 1 ? (
          <AccordionItem value="gamme">
            <AccordionTrigger>Gamme</AccordionTrigger>
            <AccordionContent>
              <Select
                value={filtres.gamme || "toutes"}
                onValueChange={(v) => onChange({ gamme: v === "toutes" ? "" : v })}
              >
                <SelectTrigger aria-label="Gamme" className="h-10 w-full rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes les gammes</SelectItem>
                  {facettes.gammes.map(([g, n]) => (
                    <SelectItem key={g} value={g}>
                      {g} ({n})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>

      {filtresArticlesActifs(filtres) ? (
        <Button variant="outline" onClick={onReset} className="mt-2 h-10 w-full text-slate-700">
          Réinitialiser les filtres
        </Button>
      ) : null}
    </Card>
  );
}
