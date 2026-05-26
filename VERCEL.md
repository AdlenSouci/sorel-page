# Déploiement Vercel (production)

Sur Vercel, tu ne crées **pas** un fichier `.env` dans le repo. Tu ajoutes les variables dans le **dashboard**.

## 1. Variables (Production)

**Vercel** → ton projet **sorel-page** → **Settings** → **Environment Variables**

| Nom | Valeur | Environnement |
|-----|--------|---------------|
| `DATABASE_URL` | URL MySQL prod (voir ci-dessous) | Production |
| `VITE_API_URL` | *(vide, ne rien mettre)* | Production |

### Construire `DATABASE_URL`

Mêmes infos que ton `.env.production` Laravel :

- Hôte : `sorel-order.fr`
- Base : `kera6497_sorel-plastique`
- User : `kera6497_sorel`
- Mot de passe : celui de la prod (encoder les caractères spéciaux dans l’URL)

Format :

```
mysql://kera6497_sorel:MOT_DE_PASSE_ENCODE@sorel-order.fr:3306/kera6497_sorel-plastique
```

Les tables `categories` et `catalogue` doivent exister sur **cette** base (pas seulement en local).

## 2. MySQL distant

L’hébergeur doit autoriser les connexions MySQL **depuis l’extérieur** (IP Vercel), sinon l’API renverra une erreur 503.

## 3. Déployer

Push sur `main` (GitHub connecté à Vercel) → déploiement auto.

## 4. Tester

- https://ton-site.vercel.app/api/health → `{ "ok": true }`
- https://ton-site.vercel.app/catalogue → liste des catégories
