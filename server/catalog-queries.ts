import type { RowDataPacket } from "mysql2";
import { pool } from "./db.js";

type ArticleRow = RowDataPacket & {
  id: number;
  reference: string | null;
  gamme: string | null;
  photo: string | null;
  couleur: string | null;
  description?: string | null;
  famille_forme?: string | null;
  contenance_ml?: string | null;
  dimensions?: string | null;
  conditionnement?: string | null;
  process_de_cuisson?: string | null;
  versage_a_chaud?: string | null;
  forme?: string | null;
  avec_couvercle?: string | null;
  operculable?: string | null;
  modulables?: string | null;
  cent_pourcent_recyclable?: string | null;
  personnalisables?: string | null;
};

/** Colonne OUI / NON : vrai, faux, ou null quand la case est vide. */
function ouiNon(v: string | null | undefined): boolean | null {
  const s = v?.trim().toUpperCase();
  if (s === "OUI") return true;
  if (s === "NON") return false;
  return null;
}

type FamilleRow = RowDataPacket & {
  famille: string | null;
  description: string | null;
  n: number;
};

type FamilleStatsRow = RowDataPacket & {
  famille: string | null;
  vmin: number | null;
  vmax: number | null;
  couleurs: string | null;
};

type VarianteRow = RowDataPacket & {
  nom: string;
  count: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Les « gammes » du site = les familles de forme (colonne famille_forme) :
 * moules ronds, moules rectangulaires, plats, couvercles… Chacune est décrite
 * par les libellés les plus fréquents de la colonne description.
 */
const FAMILLES: Record<string, string> = {
  "MOULE RECTANGLE": "Moules rectangulaires",
  "MOULE ROND": "Moules ronds",
  "MOULE OVALE": "Moules ovales",
  "PLATS & PLATEAUX DE PRESENTATION": "Plats et plateaux de présentation",
  "BOITE REFERMABLE": "Boîtes refermables",
  ASSIETTE: "Assiettes",
  ACCESSOIRES: "Accessoires",
  "MISE EN BOUCHE": "Mises en bouche",
  "MOULE RONDE": "Moules ronds",
  "MOULE CUISSON": "Moules de cuisson",
  "MOULE DEMI LUNE": "Moules demi-lune",
  "DEMOULE TRANCHE": "Démoule-tranches",
  "TERRINE RECTANGLE": "Terrines rectangulaires",
  "TERRINE RONDE": "Terrines rondes",
  "TERRINE OVALE": "Terrines ovales",
  "PLAT RECTANGLE": "Plats rectangulaires",
  "PLAT OVALE": "Plats ovales",
  "ASSIETTE RONDE": "Assiettes rondes",
  "BOITE RECTANGLE": "Boîtes rectangulaires",
  COUVERCLE: "Couvercles",
  "COUVERCLE RECTANGLE": "Couvercles rectangulaires",
  SALADIER: "Saladiers",
  "SALADE CARRE": "Saladiers carrés",
  POT: "Pots",
  SEAU: "Seaux",
  CUBE: "Cubes",
  "PALETTE A JAMBON": "Palettes à jambon",
  RECLETTE: "Raclettes",
  AUTRES: "Autres références",
};

function familleKey(raw: string | null | undefined): string {
  return (raw ?? "").trim().toUpperCase() || "AUTRES";
}

function familleNom(key: string): string {
  if (FAMILLES[key]) return FAMILLES[key];
  const low = key.toLowerCase();
  return low.charAt(0).toUpperCase() + low.slice(1);
}

function sentence(text: string): string {
  const low = text.trim().toLowerCase().replace(/\s+/g, " ");
  return low.charAt(0).toUpperCase() + low.slice(1);
}

type Famille = {
  key: string;
  nom: string;
  slug: string;
  description: string;
  /** les libellés les plus fréquents (colonne description), propres et sans doublon */
  libelles: string[];
  articleCount: number;
  /** contenance mini et maxi en ml (0 = inconnue) */
  volumeMin: number;
  volumeMax: number;
  couleurs: string[];
};

async function listFamilles(): Promise<Famille[]> {
  const [rows] = await pool.query<FamilleRow[]>(`
    SELECT famille_forme AS famille, description, COUNT(*) AS n
    FROM article
    WHERE gamme IS NOT NULL AND TRIM(gamme) != ''
    GROUP BY famille_forme, description
  `);
  const [stats] = await pool.query<FamilleStatsRow[]>(`
    SELECT famille_forme AS famille,
      MIN(CASE WHEN CAST(contenance_ml AS UNSIGNED) > 0 THEN CAST(contenance_ml AS UNSIGNED) END) AS vmin,
      MAX(CAST(contenance_ml AS UNSIGNED)) AS vmax,
      GROUP_CONCAT(DISTINCT NULLIF(TRIM(couleur), '') ORDER BY couleur SEPARATOR '|') AS couleurs
    FROM article
    WHERE gamme IS NOT NULL AND TRIM(gamme) != ''
    GROUP BY famille_forme
  `);
  const statsByKey = new Map<string, FamilleStatsRow>();
  for (const s of stats) statsByKey.set(familleKey(s.famille), s);
  const byKey = new Map<string, { n: number; desc: Map<string, number> }>();
  for (const r of rows) {
    const key = familleKey(r.famille);
    const entry = byKey.get(key) ?? { n: 0, desc: new Map<string, number>() };
    entry.n += Number(r.n);
    const d = (r.description ?? "").trim();
    // on écarte les libellés techniques (« COUVERCLE BAR10 », « MOULE 400X115 »…)
    // ni chiffres, ni « + DT » : on garde des libellés propres
    if (d && !/[\d+]/.test(d)) {
      const k = sentence(d);
      entry.desc.set(k, (entry.desc.get(k) ?? 0) + Number(r.n));
    }
    byKey.set(key, entry);
  }
  return [...byKey.entries()]
    .map(([key, v]) => ({
      key,
      nom: familleNom(key),
      slug: slugify(familleNom(key)),
      libelles: [...v.desc.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
        .slice(0, 3)
        .map(([d]) => d),
      description: [...v.desc.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
        .slice(0, 3)
        .map(([d], i) => (i === 0 ? d : d.toLowerCase()))
        .join(", "),
      articleCount: v.n,
      volumeMin: Number(statsByKey.get(key)?.vmin ?? 0),
      volumeMax: Number(statsByKey.get(key)?.vmax ?? 0),
      couleurs: (statsByKey.get(key)?.couleurs ?? "").split("|").filter(Boolean),
    }))
    .sort((a, b) => b.articleCount - a.articleCount || a.nom.localeCompare(b.nom, "fr"));
}

export async function getCategories(opts?: {
  limit?: number;
  featured?: boolean;
}) {
  const limit = opts?.limit ? Math.min(opts.limit, 100) : 0;
  const familles = await listFamilles();
  return (limit > 0 ? familles.slice(0, limit) : familles).map((f, i) => ({
    id: i + 1,
    nom: f.nom,
    slug: f.slug,
    ordre: i,
    description: f.description,
    libelles: f.libelles,
    articleCount: f.articleCount,
    volumeMin: f.volumeMin,
    volumeMax: f.volumeMax,
    couleurs: f.couleurs,
  }));
}

export async function getCatalogFilters() {
  const [categories, variantes, totalProducts] = await Promise.all([
    getCategories(),
    getVariantes(),
    countArticles(),
  ]);
  return { categories, variantes, totalProducts };
}

async function countArticles(opts?: { category?: string; variante?: string }) {
  const conditions: string[] = ["1=1"];
  const params: string[] = [];
  if (opts?.category) {
    conditions.push("gamme = ?");
    params.push(opts.category);
  }
  if (opts?.variante) {
    conditions.push("couleur = ?");
    params.push(opts.variante);
  }
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS n FROM article WHERE ${conditions.join(" AND ")}`,
    params,
  );
  return Number(rows[0]?.n ?? 0);
}

async function getVariantes() {
  const [rows] = await pool.query<VarianteRow[]>(`
    SELECT couleur AS nom, COUNT(*) AS count
    FROM article
    WHERE couleur IS NOT NULL AND TRIM(couleur) != ''
    GROUP BY couleur
    ORDER BY count DESC, nom ASC
  `);
  return rows.map((r) => ({
    nom: r.nom,
    count: Number(r.count),
  }));
}

export async function getCatalogProducts(opts?: {
  category?: string;
  q?: string;
  variante?: string;
  sort?: "gamme" | "nom";
  limit?: number;
}) {
  const categoryName = opts?.category ?? "";
  const q = opts?.q?.trim() ?? "";
  const variante = opts?.variante?.trim() ?? "";
  const sort = opts?.sort === "nom" ? "nom" : "gamme";
  const limit = Math.min(opts?.limit ?? 48, 200);

  const conditions: string[] = ["gamme IS NOT NULL", "TRIM(gamme) != ''"];
  const params: Array<string | number> = [];

  if (categoryName) {
    conditions.push("gamme = ?");
    params.push(categoryName);
  }
  if (q) {
    conditions.push("(reference LIKE ? OR gamme LIKE ? OR couleur LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (variante) {
    conditions.push("couleur = ?");
    params.push(variante);
  }
  params.push(limit);

  const orderBy = sort === "nom" ? "reference ASC" : "gamme ASC, reference ASC";

  const [rows] = await pool.query<ArticleRow[]>(
    `
    SELECT id, reference, gamme, photo, couleur
    FROM article
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${orderBy}
    LIMIT ?
    `,
    params,
  );

  return rows.map((r) => ({
    id: r.id,
    libelle: r.reference ?? "Article",
    categorieId: 0,
    categoryNom: r.gamme ?? "",
    categorySlug: r.gamme ? slugify(r.gamme) : "",
    photo: r.photo,
    variantes: r.couleur ? [r.couleur] : [],
    variantCount: r.couleur ? 1 : 0,
  }));
}

export async function getArticles(
  opts?: Parameters<typeof getCatalogProducts>[0],
) {
  return getCatalogProducts(opts);
}

/** Quelques références mises en avant sur l'accueil. */
export async function getFeaturedItems(limit = 4) {
  const n = Math.max(1, Math.min(limit, 12));
  const [rows] = await pool.query<ArticleRow[]>(
    `
    SELECT id, reference, gamme, description, famille_forme, photo, couleur
    FROM article
    WHERE gamme IS NOT NULL AND TRIM(gamme) != ''
    ORDER BY id ASC
    LIMIT ?
    `,
    [n],
  );

  return rows.map((r) => {
    const nom = familleNom(familleKey(r.famille_forme));
    return {
      id: r.id,
      codeArticle: r.reference?.trim() ?? null,
      libelle: r.reference ?? "Article",
      variante: r.couleur,
      photo: r.photo,
      categorySlug: slugify(nom),
      categoryNom: nom,
      gamme: r.gamme,
      description: r.description ? sentence(r.description) : null,
    };
  });
}

export async function getCategoryCatalog(slug: string) {
  const toutes = slug === "toutes";
  const familles = await listFamilles();
  const index = toutes ? -1 : familles.findIndex((f) => f.slug === slug);
  if (!toutes && index < 0) return null;
  const famille = toutes ? null : familles[index];

  const [items] = await pool.query<ArticleRow[]>(
    `
    SELECT id, reference, gamme, description, famille_forme, contenance_ml, dimensions, conditionnement, photo, couleur,
      process_de_cuisson, versage_a_chaud, forme, avec_couvercle, operculable, modulables,
      cent_pourcent_recyclable, personnalisables
    FROM article
    WHERE gamme IS NOT NULL AND TRIM(gamme) != ''
      ${toutes ? "" : "AND COALESCE(NULLIF(UPPER(TRIM(famille_forme)), ''), 'AUTRES') = ?"}
    ORDER BY gamme ASC, reference ASC, couleur ASC
    `,
    toutes ? [] : [famille!.key],
  );

  return {
    category: famille
      ? {
          id: index + 1,
          nom: famille.nom,
          slug: famille.slug,
          ordre: index,
          description: famille.description,
          libelles: famille.libelles,
          volumeMin: famille.volumeMin,
          volumeMax: famille.volumeMax,
          couleurs: famille.couleurs,
        }
      : { id: 0, nom: "Toutes les gammes", slug: "toutes", ordre: -1 },
    items: items.map((item) => {
      const nom = familleNom(familleKey(item.famille_forme));
      const ml = Number.parseInt(item.contenance_ml ?? "", 10);
      return {
        id: item.id,
        codeArticle: item.reference?.trim() ?? null,
        libelle: item.reference ?? "Article",
        variante: item.couleur,
        photo: item.photo,
        categorySlug: slugify(nom),
        categoryNom: nom,
        gamme: item.gamme,
        description: item.description ? sentence(item.description) : null,
        contenance: Number.isFinite(ml) && ml > 0 ? ml : null,
        dimensions: item.dimensions?.trim() || null,
        conditionnement: item.conditionnement?.trim() || null,
        cuisson: ouiNon(item.process_de_cuisson),
        versageAChaud: ouiNon(item.versage_a_chaud),
        forme: item.forme?.trim().toUpperCase() || null,
        avecCouvercle: ouiNon(item.avec_couvercle),
        operculable: ouiNon(item.operculable),
        modulable: ouiNon(item.modulables),
        recyclable: ouiNon(item.cent_pourcent_recyclable),
        personnalisable: ouiNon(item.personnalisables),
      };
    }),
  };
}

function texte(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  // « vide- » : valeur de remplissage de l'Excel pour une case sans produit associé
  return s && !/^vide-?$/i.test(s) ? s : null;
}

function enMl(v: unknown): number | null {
  const ml = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(ml) && ml > 0 ? ml : null;
}

/** Fiche d'un article : ses textes, ses caractéristiques et ses 4 produits associés. */
export async function getArticle(reference: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM article WHERE reference = ? ORDER BY id LIMIT 1",
    [reference],
  );
  const r = rows[0];
  if (!r) return null;

  const liens = [1, 2, 3, 4]
    .map((n) => ({ reference: texte(r[`produit_associe_${n}`]), photo: texte(r[`photo_produit_ass${n}`]) }))
    .filter((a): a is { reference: string; photo: string | null } => a.reference !== null);

  const [lies] = liens.length
    ? await pool.query<RowDataPacket[]>(
        "SELECT reference, description, couleur, contenance_ml, famille_forme FROM article WHERE reference IN (?) ORDER BY id",
        [liens.map((a) => a.reference)],
      )
    : [[] as RowDataPacket[]];

  const nom = familleNom(familleKey(r.famille_forme));
  return {
    id: r.id as number,
    reference: String(r.reference).trim(),
    description: r.description ? sentence(String(r.description)) : null,
    valeurCial: texte(r.valeur_cial),
    valeursAjoutees: [1, 2, 3, 4]
      .map((n) => texte(r[`valeur_ajoutee_${n}`]))
      .filter((v): v is string => v !== null),
    photo: texte(r.photo),
    couleur: texte(r.couleur),
    contenance: enMl(r.contenance_ml),
    dimensions: texte(r.dimensions),
    conditionnement: texte(r.conditionnement),
    forme: texte(r.forme)?.toUpperCase() ?? null,
    gamme: texte(r.gamme),
    categorySlug: slugify(nom),
    categoryNom: nom,
    cuisson: ouiNon(r.process_de_cuisson),
    versageAChaud: ouiNon(r.versage_a_chaud),
    avecCouvercle: ouiNon(r.avec_couvercle),
    recyclable: ouiNon(r.cent_pourcent_recyclable),
    operculable: ouiNon(r.operculable),
    modulable: ouiNon(r.modulables),
    personnalisable: ouiNon(r.personnalisables),
    associes: liens.map((a) => {
      const trouve = lies.find((l) => String(l.reference).trim() === a.reference);
      return {
        reference: a.reference,
        photo: a.photo,
        /** false quand la référence n'existe pas (encore) dans la base : pas de lien */
        existe: Boolean(trouve),
        description: trouve?.description ? sentence(String(trouve.description)) : null,
        couleur: texte(trouve?.couleur),
        contenance: enMl(trouve?.contenance_ml),
      };
    }),
  };
}

export async function checkDb() {
  await pool.query("SELECT 1");
  return process.env.DB_NAME ?? "catalogue_sorel";
}
