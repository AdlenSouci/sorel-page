/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API PHP sur o2switch (ex. https://sorel-order.fr/catalog-api) */
  readonly VITE_CATALOG_API_URL: string | undefined;
  /** Origine Laravel pour les images (ex. https://sorel-order.fr) */
  readonly VITE_SOREL_ORDER_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
