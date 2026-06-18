export type CategoryDTO = {
  id: number;
  nom: string;
  slug: string;
  ordre: number;
  articleCount: number;
};

export type VarianteFilterDTO = {
  nom: string;
  count: number;
};

export type CatalogFiltersDTO = {
  categories: CategoryDTO[];
  variantes: VarianteFilterDTO[];
  totalProducts: number;
};

/** Un produit = un libellé dans une gamme, avec ses couleurs regroupées */
export type CatalogProductDTO = {
  id: number;
  libelle: string;
  categorieId: number;
  categoryNom: string;
  categorySlug: string;
  photo: string | null;
  variantes: string[];
  variantCount: number;
};

export type ArticleSort = "gamme" | "nom";
