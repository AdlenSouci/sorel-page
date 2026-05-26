# Vercel

## Variable (Production)

| Name | Value |
|------|--------|
| `DATABASE_URL` | `mysql://kera6497_sorel:y%21a%3Db_%40DDCYJ@sorel-order.fr:3306/kera6497_sorel-plastique` |

Supprimer : `VITE_API_URL`, `VITE_CATALOG_BASE`, `VITE_SOREL_ORDER_URL`

Après changement → **Redeploy**

## Dans les logs du build, tu dois voir

`OK : XX catégorie(s) → src/data/categories.prod.json`

Si `DATABASE_URL manquant` → variable mal nommée ou pas en Production.

## Push

```bash
git add .
git commit -m "fix categories vercel"
git push
```
