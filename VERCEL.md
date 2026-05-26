# Vercel + base distante

Le site Vercel est **statique**. L’API catalogue est sur **sorel-order.fr** (Laravel, déjà connecté à MySQL).

## Variable Vercel (obligatoire)

**Settings → Environment Variables → Production**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://sorel-order.fr` |

Puis **Redeploy**.

Tu n’as **pas** besoin de `DATABASE_URL` sur Vercel.

## Tester

1. https://sorel-order.fr/api/categories → JSON des catégories  
2. https://ton-site.vercel.app/catalogue → liste des catégories  
