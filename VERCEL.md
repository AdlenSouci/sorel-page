# Déploiement Vercel

## Variables (Production)

1. **`DATABASE_URL`** — connexion MySQL de ta base en ligne (tables `categories`, `catalogue`)
2. **`VITE_API_URL`** — **ne pas créer** (ou laisser vide)

Redeploy après modification.

## Test

- https://ton-site.vercel.app/api/health
- https://ton-site.vercel.app/api/categories
- https://ton-site.vercel.app/catalogue

Si `/api/health` échoue : l’hébergeur MySQL doit autoriser les connexions distantes (cPanel → MySQL distant / accès distant).
