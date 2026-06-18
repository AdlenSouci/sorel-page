# Catalogue vitrine — à envoyer sur l’hébergeur (FileZilla)

Ce dossier **n’est pas** le site sorel-order. C’est seulement 3 fichiers PHP qui lisent `categories` et `catalogue` dans **la même base MySQL**.

## Étapes

1. Copier `config.example.php` → `config.php` et remplir le mot de passe MySQL.
2. Envoyer tout le dossier `catalog-api` sur le serveur, par ex. :
   `public_html/catalog-api/`
3. Tester dans le navigateur :
   `https://sorel-order.fr/catalog-api/categories.php`
   → doit afficher du JSON.
4. Sur **Vercel** → variable :
   `VITE_CATALOG_API_URL` = `https://sorel-order.fr/catalog-api`
5. **Redeploy** sorel_page.

Hôte MySQL : souvent `127.0.0.1` sur le serveur (pas `sorel-order.fr`).
