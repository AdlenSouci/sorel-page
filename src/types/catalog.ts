export type CategoryDTO = {
  id: number;
  nom: string;
  slug: string;
  ordre: number;
  articleCount: number;
  /** libellés les plus fréquents de la colonne description */
  description?: string;
  libelles?: string[];
  /** contenance mini / maxi en ml (0 = inconnue) */
  volumeMin?: number;
  volumeMax?: number;
  /** coloris disponibles dans la gamme */
  couleurs?: string[];
};
