/**
 * Présentation des gammes (familles de forme) : regroupement éditorial en trois
 * rayons et mise en forme des contenances. Le regroupement ne vient pas de la base :
 * il se déduit du nom de la gamme.
 */
export type Groupe = { id: string; titre: string; court: string; intro: string };

export const GROUPES: Groupe[] = [
  {
    id: "moules",
    titre: "Moules et terrines",
    court: "Moules",
    intro: "Pour cuire, démouler et conserver.",
  },
  {
    id: "plats",
    titre: "Plats, assiettes et saladiers",
    court: "Plats",
    intro: "Pour présenter et servir.",
  },
  {
    id: "boites",
    titre: "Boîtes, pots et couvercles",
    court: "Boîtes",
    intro: "Pour fermer, transporter et stocker.",
  },
];

export function groupeDe(slug: string): Groupe {
  const s = slug.toLowerCase();
  if (/^(moule|demoule)/.test(s)) return GROUPES[0];
  if (/^(plat|assiette|saladier|terrine|raclette)/.test(s)) return GROUPES[1];
  return GROUPES[2];
}

function litres(ml: number): string {
  if (ml < 1000) return `${ml} ml`;
  const l = ml / 1000;
  return `${Number.isInteger(l) ? l : l.toFixed(1).replace(".", ",")} L`;
}

/** « 40 ml – 5 L », « 1,5 L » ou chaîne vide si la contenance est inconnue. */
export function formatVolume(min?: number, max?: number): string {
  const lo = min ?? 0;
  const hi = max ?? 0;
  if (!hi) return "";
  if (!lo || lo === hi) return litres(hi);
  return `${litres(lo)} – ${litres(hi)}`;
}

/* ---------- filtres de la page Catalogue ---------- */

export type TriGammes = "articles" | "nom";

export type FiltresGammes = {
  q: string;
  groupe: string; // "" = tous les rayons
  couleur: string; // "" = tous les coloris
  volume: string; // "" | "petit" | "moyen" | "grand"
  tri: TriGammes;
};

export const FILTRES_VIDES: FiltresGammes = {
  q: "",
  groupe: "",
  couleur: "",
  volume: "",
  tri: "articles",
};

export const TRANCHES_VOLUME = [
  { id: "petit", label: "Jusqu'à 500 ml", min: 0, max: 500 },
  { id: "moyen", label: "De 500 ml à 2 L", min: 500, max: 2000 },
  { id: "grand", label: "Plus de 2 L", min: 2000, max: Infinity },
] as const;

function sansAccent(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

type Filtrable = {
  slug: string;
  nom: string;
  description?: string;
  articleCount: number;
  volumeMin?: number;
  volumeMax?: number;
  couleurs?: string[];
};

export function filtrerGammes<T extends Filtrable>(gammes: T[], f: FiltresGammes): T[] {
  const needle = sansAccent(f.q.trim());
  const tranche = TRANCHES_VOLUME.find((t) => t.id === f.volume);
  const rows = gammes.filter((g) => {
    if (f.groupe && groupeDe(g.slug).id !== f.groupe) return false;
    if (f.couleur && !(g.couleurs ?? []).includes(f.couleur)) return false;
    if (needle && !sansAccent(`${g.nom} ${g.description ?? ""}`).includes(needle)) return false;
    if (tranche) {
      const lo = g.volumeMin || g.volumeMax || 0;
      const hi = g.volumeMax || 0;
      if (!hi) return false; // contenance inconnue
      // la gamme convient si sa plage de contenances chevauche la tranche
      if (hi < tranche.min || lo >= tranche.max) return false;
    }
    return true;
  });
  return rows.sort((a, b) =>
    f.tri === "nom"
      ? a.nom.localeCompare(b.nom, "fr")
      : b.articleCount - a.articleCount || a.nom.localeCompare(b.nom, "fr"),
  );
}

export function filtresActifs(f: FiltresGammes): boolean {
  return Boolean(f.q.trim() || f.groupe || f.couleur || f.volume || f.tri !== "articles");
}

/* ---------- filtres du catalogue (colonne de gauche) ---------- */

export type Facettes = {
  q: string;
  couleur: string;
  volume: string;
};

export const FACETTES_VIDES: Facettes = { q: "", couleur: "", volume: "" };

/* ---------- mise en forme des articles ---------- */

/** « L 195  l 195  h 48 » → « 195 × 195 × 48 mm » (— si les dimensions sont inconnues). */
export function formatDimensions(raw?: string | null): string {
  const m = /L\s*(\d+)\s+l\s*(\d+)\s+h\s*(\d+)/i.exec(raw ?? "");
  if (!m) return raw?.trim() || "—";
  const [, a, b, c] = m;
  if (Number(a) === 0 && Number(b) === 0 && Number(c) === 0) return "—";
  return `${a} × ${b} × ${c} mm`;
}

/** « 1680 » → « 1 680 » (pièces par carton). */
export function formatConditionnement(raw?: string | null): string {
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n.toLocaleString("fr-FR") : "—";
}

/* ---------- visuels des gammes ---------- */

/** Gammes pour lesquelles une photo de produit est disponible (public/gammes/<slug>.webp). */
const GAMMES_AVEC_PHOTO = new Set([
  "assiettes-rondes",
  "boites-rectangulaires",
  "couvercles",
  "demoule-tranches",
  "moules-de-cuisson",
  "moules-demi-lune",
  "moules-rectangulaires",
  "moules-ronds",
  "plats-ovales",
  "plats-rectangulaires",
  "pots",
  "raclettes",
  "saladiers",
  "terrines-ovales",
]);

/** Gammes dont le nom a changé avec le nouvel Excel : elles gardent la photo de la gamme voisine. */
const PHOTO_VOISINE: Record<string, string> = {
  "moules-ovales": "plats-ovales",
  "plats-et-plateaux-de-presentation": "plats-rectangulaires",
  "boites-refermables": "boites-rectangulaires",
  assiettes: "assiettes-rondes",
};

export function photoGamme(slug: string): string | null {
  const nom = PHOTO_VOISINE[slug] ?? slug;
  return GAMMES_AVEC_PHOTO.has(nom) ? `/gammes/${nom}.webp` : null;
}
