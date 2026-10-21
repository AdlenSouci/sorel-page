/**
 * Adaptateur pour les fonctions serverless de `api/`.
 *
 * Il n'y a plus qu'UNE implémentation des requêtes catalogue :
 * `server/catalog-queries.ts` (table `article` de catalogue_sorel).
 * Ce fichier ne fait que conserver les anciens noms utilisés par `api/*.ts`.
 *
 * Ne pas réintroduire de requêtes ici : elles finiraient par diverger de
 * celles utilisées en local — ce qui donne un site qui marche sur le poste
 * du dev et un catalogue vide en production.
 */
export {
  getCategories as listCategories,
  getCatalogFilters as listCatalogFilters,
  getCatalogProducts as listCatalogProducts,
  getFeaturedItems as listFeaturedProducts,
  getCategoryCatalog,
  getArticle,
  checkDb,
} from "../server/catalog-queries.js";
