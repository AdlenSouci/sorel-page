// Dresse l'index des photos d'articles : public/img/ARTICLE/<référence>/<fichier> → public/img/photos.json.
// Les noms de fichier de la base (1000R.jpg) ne respectent pas toujours la casse du disque (1000R.JPG) :
// l'index permet au site de retrouver le vrai fichier sans tenir compte des majuscules.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "img");
const dossier = join(racine, "ARTICLE");
const IMAGES = new Set([".jpg", ".jpeg", ".png", ".webp"]);

if (!existsSync(dossier)) mkdirSync(dossier, { recursive: true });

const index = {};
let fichiers = 0;
for (const ref of readdirSync(dossier)) {
  const chemin = join(dossier, ref);
  if (!statSync(chemin).isDirectory()) continue;
  // seuls les dossiers dont la référence finit par -000 servent au site ; les -001, -002… et les FT… sont ignorés
  if (!/-000$/i.test(ref.trim()) || /^FT/i.test(ref.trim())) continue;
  const photos = readdirSync(chemin)
    .filter((f) => IMAGES.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "fr"));
  if (photos.length === 0) continue;
  // clé en minuscules ; d = vrai nom du dossier, f = vrais noms des fichiers
  index[ref.trim().toLowerCase()] = { d: ref, f: photos };
  fichiers += photos.length;
}

writeFileSync(join(racine, "photos.json"), JSON.stringify(index));
console.log(`[photos] ${Object.keys(index).length} articles avec photo, ${fichiers} fichiers → public/img/photos.json`);
