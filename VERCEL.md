# Déploiement Vercel

Le catalogue lit la **base MySQL sur o2switch** via l’API PHP (`hosting/catalog-api`), pas via une connexion directe depuis Vercel.

## Variables d’environnement (Vercel → Settings → Environment Variables)

| Variable | Exemple |
|----------|---------|
| `VITE_CATALOG_API_URL` | `https://sorel-order.fr/catalog-api` |
| `VITE_SOREL_ORDER_URL` | `https://sorel-order.fr` |

Puis **Redeploy** (obligatoire après changement de variable `VITE_*`).

## API PHP sur o2switch

1. Copier `hosting/catalog-api/config.example.php` → `config.php` (mot de passe MySQL).
2. Envoyer le dossier `catalog-api` sur le serveur (ex. `public_html/catalog-api/`).
3. Tester dans le navigateur :
   - `https://sorel-order.fr/catalog-api/categories.php`
   - `https://sorel-order.fr/catalog-api/items.php?slug=bol`

## Développement local

- **Avec l’API en ligne** : copier `.env.example` → `.env`, `npm run dev`.
- **Avec Express + Prisma** : laisser `VITE_CATALOG_API_URL` vide, `npm run dev:full` + `DATABASE_URL`.

Ne pas committer `.env` (secrets).
