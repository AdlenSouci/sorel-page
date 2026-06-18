/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API PHP o2switch — ex. https://sorel-order.fr/sorel-catalog-api.php */
  readonly VITE_CATALOG_API_URL: string | undefined;
  /** Optionnel : préfixe pour chemins photo /storage/… */
  readonly VITE_MEDIA_BASE_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
