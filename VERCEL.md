# Vercel

Le build est simple : `npm run build` (pas de connexion MySQL sur Vercel).

Les catégories sont dans `src/data/categories.prod.json` (déjà rempli).

## Pour mettre à jour les catégories plus tard

Sur ton PC, dans `sorel_page` :

```powershell
$env:DATABASE_URL="mysql://..."   # ta base en ligne
node scripts/fetch-categories.mjs
git add src/data/categories.prod.json
git commit -m "maj categories"
git push
```

## Vercel

- Pas besoin de `DATABASE_URL` pour afficher le catalogue
- Supprimer Neon si présent
- **Build Command** : vide (utilise vercel.json)
