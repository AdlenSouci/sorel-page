import { useEffect, useState } from "react";

/** Index dressé par scripts/index-photos.mjs : référence (minuscules) → vrai dossier et fichiers. */
type IndexPhotos = Record<string, { d: string; f: string[] }>;

let chargement: Promise<IndexPhotos> | null = null;

function charger(): Promise<IndexPhotos> {
  chargement ??= fetch("/img/photos.json", { cache: "no-cache" })
    .then((r) => (r.ok ? (r.json() as Promise<IndexPhotos>) : {}))
    .catch(() => ({}));
  return chargement;
}

const sansExtension = (nom: string) => nom.toLowerCase().replace(/\.[a-z0-9]+$/, "");

/**
 * Adresse de la photo d'un article : public/img/ARTICLE/<référence>/<fichier>.
 * Le fichier de la base est retrouvé sans tenir compte de la casse ni de l'extension ;
 * à défaut, on prend la première photo du dossier de la référence.
 */
export function photoArticle(
  index: IndexPhotos,
  reference: string | null | undefined,
  fichier?: string | null,
): string | null {
  const entree = reference ? index[reference.trim().toLowerCase()] : undefined;
  if (!entree) return null;
  const voulu = fichier?.trim().toLowerCase();
  const trouve =
    (voulu && entree.f.find((f) => f.toLowerCase() === voulu)) ||
    (voulu && entree.f.find((f) => sansExtension(f) === sansExtension(voulu))) ||
    entree.f[0];
  return `/img/ARTICLE/${encodeURIComponent(entree.d)}/${encodeURIComponent(trouve)}`;
}

/** Renvoie une fonction (référence, fichier) → adresse de la photo, ou null tant que l'index n'est pas chargé. */
export function usePhotoArticle(): (reference?: string | null, fichier?: string | null) => string | null {
  const [index, setIndex] = useState<IndexPhotos | null>(null);
  useEffect(() => {
    let annule = false;
    void charger().then((i) => {
      if (!annule) setIndex(i);
    });
    return () => {
      annule = true;
    };
  }, []);
  return (reference, fichier) => (index ? photoArticle(index, reference, fichier) : null);
}
