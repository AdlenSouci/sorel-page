# Déploiement Vercel

Site **100 % statique** : les catégories sont dans `src/data/categories.prod.json`.

- Pas de `DATABASE_URL` sur Vercel
- Pas d’appel à sorel-order.fr

## Push

```bash
git add .
git commit -m "fix vercel static deploy"
git push
```

Sur Vercel : le dernier deploy doit être **Ready** (vert).

Puis **Ctrl+Shift+R** sur https://sorel-page.vercel.app/catalogue
