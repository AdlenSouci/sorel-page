# sorel-page sur Vercel

**Site vitrine :** https://sorel-page.vercel.app  
**Base MySQL :** hébergée chez o2switch (tables `categories`, `catalogue`).

Ce dépôt n’est **pas** le site sorel-order.fr (commandes Laravel). Les deux peuvent partager la **même base**, mais le catalogue vitrine tourne sur **sorel-page.vercel.app**.

## Variables sur Vercel (Settings → Environment Variables)

Importer les mêmes identifiants que dans votre `.env` :

| Variable | Exemple |
|----------|---------|
| `DB_HOST` | hôte MySQL cPanel (accès distant), pas forcément `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | `kera6497_sorel-plastique` |
| `DB_USERNAME` | `kera6497_sorel` |
| `DB_PASSWORD` | votre mot de passe |

**Ou** une seule ligne : `DATABASE_URL=mysql://user:pass@host:3306/kera6497_sorel-plastique`

Ne pas définir `VITE_CATALOG_API_URL` ni `VITE_SOREL_ORDER_URL` (inutiles pour ce site).

**Redeploy** après chaque changement.

## Test

https://sorel-page.vercel.app/api/categories → JSON des catégories.

Puis https://sorel-page.vercel.app/catalogue
