import { itemTitle } from "./api";
import type { CatalogueItemDTO } from "../types/category";

/** 1500 → « 1,5 L », 750 → « 750 ml » */
export function formatMl(v: number): string {
  return v >= 1000 ? `${(v / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} L` : `${v} ml`;
}

/** Mesures filtrables par plage : le conditionnement (pièces par carton) et les 3 dimensions. */
export type CleMesure = "conditionnement" | "longueur" | "largeur" | "hauteur";

export const MESURES: { cle: CleMesure; label: string; unite: string; pas: number }[] = [
  { cle: "conditionnement", label: "Pièces par carton", unite: "", pas: 10 },
  { cle: "longueur", label: "Longueur", unite: " mm", pas: 5 },
  { cle: "largeur", label: "Largeur", unite: " mm", pas: 5 },
  { cle: "hauteur", label: "Hauteur", unite: " mm", pas: 5 },
];

/** Valeur d'une mesure pour un article, ou null si la base ne la donne pas (ou donne 0). */
export function mesure(it: CatalogueItemDTO, cle: CleMesure): number | null {
  if (cle === "conditionnement") {
    const n = Number.parseInt(it.conditionnement ?? "", 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  const m = /L\s*(\d+)\s+l\s*(\d+)\s+h\s*(\d+)/i.exec(it.dimensions ?? "");
  if (!m) return null;
  const n = Number(cle === "longueur" ? m[1] : cle === "largeur" ? m[2] : m[3]);
  return n > 0 ? n : null;
}

export type Plage = { min: number | null; max: number | null };

export type TriArticles = "defaut" | "nom" | "couleur" | "contenance";

/** Cases à cocher tirées des colonnes OUI / NON de la base. */
export type CleBool =
  | "cuisson"
  | "versageAChaud"
  | "avecCouvercle"
  | "recyclable"
  | "operculable"
  | "modulable"
  | "personnalisable";

/** Les mêmes rubriques que le filtre de l'ancien site : Process, Formats, Autres. */
export type GroupeOption = "process" | "format" | "autres";

export const OPTIONS: { cle: CleBool; label: string; groupe: GroupeOption }[] = [
  { cle: "cuisson", label: "Cuisson", groupe: "process" },
  { cle: "versageAChaud", label: "Versage à chaud", groupe: "process" },
  { cle: "avecCouvercle", label: "Avec couvercle", groupe: "format" },
  { cle: "recyclable", label: "100 % recyclable", groupe: "autres" },
  { cle: "operculable", label: "Operculable", groupe: "autres" },
  { cle: "modulable", label: "Modulable", groupe: "autres" },
  { cle: "personnalisable", label: "Personnalisable", groupe: "autres" },
];

/** Dans l'ordre de l'ancien site : Rond, Carré, Rectangle, Ovale. */
export const FORMES: Record<string, string> = {
  RONDE: "Rond",
  CARRE: "Carré",
  RECTANGLE: "Rectangle",
  OVAL: "Ovale",
};

export type FiltresArticles = {
  q: string;
  gamme: string;
  couleur: string;
  forme: string;
  /** options cochées */
  options: CleBool[];
  /** contenance retenue en ml ; null = pas de limite de ce côté */
  volMin: number | null;
  volMax: number | null;
  mesures: Record<CleMesure, Plage>;
  tri: TriArticles;
};

export const FILTRES_ARTICLES_VIDES: FiltresArticles = {
  q: "",
  gamme: "",
  couleur: "",
  forme: "",
  options: [],
  volMin: null,
  volMax: null,
  mesures: {
    conditionnement: { min: null, max: null },
    longueur: { min: null, max: null },
    largeur: { min: null, max: null },
    hauteur: { min: null, max: null },
  },
  tri: "defaut",
};

export function filtresArticlesActifs(f: FiltresArticles): boolean {
  return Boolean(
    f.q.trim() ||
      f.gamme ||
      f.couleur ||
      f.forme ||
      f.options.length ||
      f.volMin !== null ||
      f.volMax !== null ||
      MESURES.some((m) => f.mesures[m.cle].min !== null || f.mesures[m.cle].max !== null) ||
      f.tri !== "defaut",
  );
}

function sansAccent(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Recherche : chaque mot doit se trouver quelque part dans l'article — référence, description,
 * nom de la gamme, code de gamme, coloris, forme, contenance (« 1000 », « 2 l »), dimensions,
 * ou l'une de ses caractéristiques (« recyclable », « cuisson », « operculable »…).
 */
function texteRecherche(it: CatalogueItemDTO): string {
  const caracteristiques = OPTIONS.filter((o) => it[o.cle] === true).map((o) => o.label);
  return sansAccent(
    [
      it.libelle,
      it.codeArticle,
      it.description,
      it.categoryNom,
      it.gamme,
      it.variante,
      it.forme ? FORMES[it.forme] ?? it.forme : null,
      it.contenance ? `${it.contenance} ml ${formatMl(it.contenance)}` : null,
      it.dimensions,
      ...caracteristiques,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function filtrerArticles(items: CatalogueItemDTO[], f: FiltresArticles): CatalogueItemDTO[] {
  const mots = sansAccent(f.q.trim()).split(/\s+/).filter(Boolean);
  let rows = items.filter((it) => {
    if (f.gamme && it.gamme !== f.gamme) return false;
    if (f.couleur && it.variante?.trim() !== f.couleur) return false;
    if (f.forme && it.forme !== f.forme) return false;
    if (f.options.some((o) => it[o] !== true)) return false;
    if (f.volMin !== null || f.volMax !== null) {
      if (!it.contenance) return false; // contenance inconnue
      if (f.volMin !== null && it.contenance < f.volMin) return false;
      if (f.volMax !== null && it.contenance > f.volMax) return false;
    }
    for (const m of MESURES) {
      const { min, max } = f.mesures[m.cle];
      if (min === null && max === null) continue;
      const v = mesure(it, m.cle);
      if (v === null) return false; // mesure inconnue
      if (min !== null && v < min) return false;
      if (max !== null && v > max) return false;
    }
    if (mots.length) {
      const texte = texteRecherche(it);
      if (!mots.every((m) => texte.includes(m))) return false;
    }
    return true;
  });
  if (f.tri === "nom") {
    rows = [...rows].sort((a, b) => itemTitle(a).localeCompare(itemTitle(b), "fr"));
  } else if (f.tri === "couleur") {
    rows = [...rows].sort((a, b) => (a.variante ?? "").localeCompare(b.variante ?? "", "fr"));
  } else if (f.tri === "contenance") {
    rows = [...rows].sort((a, b) => (a.contenance ?? Infinity) - (b.contenance ?? Infinity));
  }
  return rows;
}
