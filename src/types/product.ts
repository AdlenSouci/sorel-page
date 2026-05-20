export type ProductDTO = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
