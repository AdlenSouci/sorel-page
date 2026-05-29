/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optionnel : préfixe pour chemins photo relatifs en base */
  readonly VITE_MEDIA_BASE_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
