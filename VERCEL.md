# sorel-page — déploiement GitHub → Vercel

## Variables Vercel (Settings → Environment Variables)

Pour **Aiven MySQL** :

| Variable | Exemple |
|----------|---------|
| `DB_HOST` | `mysql-xxxxx.j.aivencloud.com` |
| `DB_PORT` | `19534` |
| `DB_DATABASE` | `defaultdb` |
| `DB_USERNAME` | `avnadmin` |
| `DB_PASSWORD` | *(mot de passe Aiven)* |
| `DB_SSL` | `1` |

Optionnel : `VITE_MEDIA_BASE_URL` = `https://sorel-order.fr`

**Ne pas** définir `VITE_CATALOG_API_URL` — le site utilise `/api/*` sur Vercel + Aiven MySQL.

Après changement → **Redeploy**.

## Import des données sur Aiven (une fois)

Le site lit la table **`article`** (pas `categories` / `catalogue`).

```powershell
# 1. Exporter depuis MySQL local (catalogue_sorel)
node scripts/export-article-cloud.mjs

# 2. Importer vers Aiven
$env:DB_HOST="mysql-xxxxx.i.aivencloud.com"
$env:DB_PORT="19534"
$env:DB_USERNAME="avnadmin"
$env:DB_PASSWORD="votre_mot_de_passe"
$env:DB_DATABASE="defaultdb"
node scripts/import-aiven.mjs
```

Après import → **Redeploy** sur Vercel (Deployments → ⋮ → Redeploy).

Le certificat CA Aiven peut être placé dans `certs/aiven-ca.pem` (gitignoré) ou collé dans `DB_SSL_CA`.

## Test

- `https://votre-site.vercel.app/api/categories` → JSON
- `/catalogue` et l'accueil

## Local

`.env` avec `DB_HOST=localhost` … ou pointer vers Aiven pour tester la prod.
