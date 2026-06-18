# sorel-page — déploiement GitHub → Vercel uniquement

Ce dépôt **sorel_page** : vous poussez sur **GitHub**, Vercel déploie tout seul.  
Rien à envoyer à la main sur Vercel.

## Ce qui part avec GitHub (automatique)

- Le site React → https://sorel-page.vercel.app
- Les routes API dans le dossier `api/` :
  - `/api/categories`
  - `/api/categories/:slug/items`
  - `/api/featured`

Le front appelle **`/api/...` sur le même domaine** (sorel-page.vercel.app), pas sorel-order.fr.

## Ce que vous configurez sur vercel.com (une fois)

Projet lié à GitHub → **Settings → Environment Variables** :

| Variable | Valeur |
|----------|--------|
| `DB_HOST` | Hôte MySQL **distant** (cPanel o2switch, pas `127.0.0.1`) |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | `kera6497_sorel-plastique` |
| `DB_USERNAME` | `kera6497_sorel` |
| `DB_PASSWORD` | votre mot de passe |

**Ne pas** définir `VITE_CATALOG_API_URL` (réservé à un autre scénario, pas GitHub→Vercel).

Optionnel : `VITE_MEDIA_BASE_URL` = `https://sorel-order.fr` si les photos en base sont des chemins `/storage/...`

Chaque **push sur GitHub** = nouveau déploiement. Après changement de variables, cliquer **Redeploy**.

## Test

https://sorel-page.vercel.app/api/categories → JSON

Puis `/catalogue` et l’accueil.

## Si /api/categories renvoie encore une erreur

o2switch bloque souvent MySQL depuis l’extérieur. Dans cPanel : activer **accès distant MySQL** et utiliser l’hôte indiqué (ex. `kera6497.odns.fr`), pas `sorel-order.fr`.

## Le fichier `hosting/sorel-catalog-api.php`

Ce n’est **pas** pour Vercel ni pour GitHub→Vercel.  
C’est pour le **serveur sorel-order.fr** (autre hébergement), seulement si la connexion MySQL depuis Vercel est impossible.

Pour sorel-page, tout doit passer par **Git push + variables Vercel**.
