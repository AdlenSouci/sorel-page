# sorel-page.vercel.app

## Pourquoi /api/categories échoue sur Vercel

Vercel **ne peut pas** se connecter à MySQL o2switch (`DB_HOST=sorel-order.fr`) : la base n’accepte que les connexions **depuis le serveur o2switch** (127.0.0.1).

## Solution (obligatoire)

### 1. Un fichier PHP sur sorel-order.fr

1. Ouvrir `hosting/sorel-catalog-api.php`
2. Remplacer `METS_TON_MOT_DE_PASSE_ICI` par le mot de passe MySQL
3. Envoyer le fichier à la **racine publique** du site (FileZilla → `public_html/sorel-catalog-api.php`)
4. Tester : https://sorel-order.fr/sorel-catalog-api.php?action=categories → JSON

### 2. Variable sur Vercel (build)

| Variable | Valeur |
|----------|--------|
| `VITE_CATALOG_API_URL` | `https://sorel-order.fr/sorel-catalog-api.php` |
| `VITE_MEDIA_BASE_URL` | `https://sorel-order.fr` (si photos en /storage/…) |

**Redeploy** après ajout.

### 3. Vérifier

- https://sorel-page.vercel.app/catalogue
- Accueil → « Nos gammes phares » = vrais articles

Ne pas compter sur `DB_*` / `DATABASE_URL` sur Vercel pour le catalogue (sauf accès MySQL distant activé dans cPanel).
