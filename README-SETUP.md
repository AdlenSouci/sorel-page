# sorel_page — catalogue vitrine

Site React (Vercel) + API PHP sur o2switch (MySQL `categories` / `catalogue`).

## Production (Vercel)

Variables obligatoires :

- `VITE_CATALOG_API_URL` = `https://sorel-order.fr/catalog-api`
- `VITE_SOREL_ORDER_URL` = `https://sorel-order.fr`

Voir `VERCEL.md` et déployer `hosting/catalog-api/` sur o2switch.

## Développement local

```bash
npm install
cp .env.example .env   # ou copie manuelle sous Windows
npm run dev
```

Avec `.env` pointant vers l’API PHP en ligne, le front utilise la vraie base sans Express.

**Alternative** : laisser `VITE_CATALOG_API_URL` vide et lancer :

```bash
npm run dev:full
```

(Express + `DATABASE_URL` vers MySQL local ou tunnel.)
