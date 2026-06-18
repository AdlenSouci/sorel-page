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

**Ne pas** définir `VITE_CATALOG_API_URL` pour le déploiement standard.

Après changement → **Redeploy**.

## Import des données sur Aiven (une fois)

```bash
# 1. Générer le SQL catalogue (depuis le dump fixé)
node scripts/build-cloud-sql-from-dump.mjs

# 2. Importer (avec vos identifiants Aiven en variables d'env)
set DB_HOST=mysql-xxxxx.j.aivencloud.com
set DB_PORT=19534
set DB_USERNAME=avnadmin
set DB_PASSWORD=votre_mot_de_passe
set DB_DATABASE=defaultdb
node scripts/import-aiven.mjs
```

Le certificat CA Aiven peut être placé dans `certs/aiven-ca.pem` (gitignoré).

## Test

- `https://votre-site.vercel.app/api/categories` → JSON
- `/catalogue` et l'accueil

## Local

`.env` avec `DB_HOST=localhost` … ou pointer vers Aiven pour tester la prod.
