# Afficher les catégories sur Vercel

## 1. Un fichier sur le serveur (FileZilla)

Fichier : `hosting/sorel-categories.php`  
→ envoyer dans le dossier **public** du site (là où est `index.php`).

Renommer rien : **`sorel-categories.php`**

Ouvrir le fichier sur le serveur et mettre le **vrai mot de passe** MySQL (ligne `$password`, comme dans `.env` Laravel).  
`$host` = souvent `localhost` sur l’hébergeur.

## 2. Test

https://sorel-order.fr/sorel-categories.php  
→ doit afficher du JSON.

## 3. Vercel

**Aucune variable obligatoire.**  
Push sur GitHub → redeploy.

Le site appelle automatiquement cette URL en production.

## 4. Local

```bash
npm run dev:full
```

Pas besoin du fichier PHP en local.
