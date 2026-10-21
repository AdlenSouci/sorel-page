export type CategoryDTO = {
  id: number;
  nom: string;
  slug: string;
  ordre: number;
  productCount?: number;
  /** libellés les plus fréquents de la colonne description */
  description?: string;
  libelles?: string[];
  volumeMin?: number;
  volumeMax?: number;
  couleurs?: string[];
};

export type CatalogueItemDTO = {
  id: number;
  codeArticle: string | null;
  libelle: string;
  variante: string | null;
  photo: string | null;
  categorySlug: string;
  categoryNom: string;
  /** code de gamme (colonne gamme) */
  gamme?: string | null;
  description?: string | null;
  /** contenance en ml */
  contenance?: number | null;
  /** « L 195  l 195  h 48 » (mm) */
  dimensions?: string | null;
  /** pièces par carton */
  conditionnement?: string | null;
  /** cases OUI / NON de la base ; null = non renseigné */
  cuisson?: boolean | null;
  versageAChaud?: boolean | null;
  /** RECTANGLE, RONDE, CARRE, OVAL */
  forme?: string | null;
  avecCouvercle?: boolean | null;
  operculable?: boolean | null;
  modulable?: boolean | null;
  recyclable?: boolean | null;
  personnalisable?: boolean | null;
};

export type ProduitAssocieDTO = {
  reference: string;
  /** nom du fichier photo (colonne photo_produit_assN) */
  photo: string | null;
  /** false : la référence n'est pas (encore) dans la base, donc pas de lien */
  existe: boolean;
  description: string | null;
  couleur: string | null;
  contenance: number | null;
};

/** Fiche complète d'un article (page article). */
export type ArticleDetailDTO = {
  id: number;
  reference: string;
  description: string | null;
  /** nom commercial, affiché avant les valeurs ajoutées */
  valeurCial: string | null;
  valeursAjoutees: string[];
  photo: string | null;
  couleur: string | null;
  contenance: number | null;
  dimensions: string | null;
  conditionnement: string | null;
  forme: string | null;
  gamme: string | null;
  categorySlug: string;
  categoryNom: string;
  cuisson: boolean | null;
  versageAChaud: boolean | null;
  avecCouvercle: boolean | null;
  recyclable: boolean | null;
  operculable: boolean | null;
  modulable: boolean | null;
  personnalisable: boolean | null;
  associes: ProduitAssocieDTO[];
};

export type CategoryCatalogDTO = {
  category: Pick<
    CategoryDTO,
    "id" | "nom" | "slug" | "ordre" | "description" | "libelles" | "volumeMin" | "volumeMax" | "couleurs"
  >;
  items: CatalogueItemDTO[];
};
