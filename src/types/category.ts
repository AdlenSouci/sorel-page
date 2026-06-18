export type CategoryDTO = {
  id: number;
  nom: string;
  slug: string;
  ordre: number;
  productCount?: number;
};

export type CatalogueItemDTO = {
  id: number;
  codeArticle: string | null;
  libelle: string;
  variante: string | null;
  photo: string | null;
  categorySlug: string;
  categoryNom: string;
};

export type CategoryCatalogDTO = {
  category: Pick<CategoryDTO, "id" | "nom" | "slug" | "ordre">;
  items: CatalogueItemDTO[];
};
