import { useSyncExternalStore } from "react";

/**
 * Liste de souhaits stockée dans le navigateur (localStorage).
 * Pas de compte, pas de backend : le client empile des références puis
 * envoie le tout en demande de devis par mail.
 */
export type WishlistItem = {
  id: number;
  reference: string;
  gamme: string;
  couleur: string | null;
  photo: string | null;
};

const KEY = "sorel:wishlist";

const listeners = new Set<() => void>();
let cache: WishlistItem[] | null = null;

function read(): WishlistItem[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: WishlistItem[]) {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* quota plein ou navigation privée : on garde au moins l'état en mémoire */
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Synchronise les onglets ouverts en parallèle.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: WishlistItem[] = [];

export function useWishlist() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function isInWishlist(items: WishlistItem[], id: number) {
  return items.some((it) => it.id === id);
}

export function toggleWishlist(item: WishlistItem) {
  const items = read();
  const next = items.some((it) => it.id === item.id)
    ? items.filter((it) => it.id !== item.id)
    : [...items, item];
  write(next);
}

export function removeFromWishlist(id: number) {
  write(read().filter((it) => it.id !== id));
}

export function clearWishlist() {
  write([]);
}

/**
 * Encode les paramètres d'un `mailto:`.
 * URLSearchParams sort les espaces en `+`, que les clients mail affichent
 * littéralement dans le corps — il faut du %20.
 */
export function mailtoQuery(params: Record<string, string>) {
  return new URLSearchParams(params).toString().replace(/\+/g, "%20");
}

/** Corps du mail de demande de devis, prérempli avec les références retenues. */
export function buildQuoteMail(items: WishlistItem[]) {
  const lignes = items.map((it, i) => {
    const details = [it.gamme, it.couleur].filter(Boolean).join(" — ");
    return `${i + 1}. ${it.reference}${details ? ` (${details})` : ""}`;
  });

  return [
    "Bonjour,",
    "",
    "Je souhaite recevoir un devis pour les références suivantes :",
    "",
    ...lignes,
    "",
    "Quantités souhaitées : ",
    "Délai souhaité : ",
    "",
    "Société : ",
    "Nom : ",
    "Téléphone : ",
    "",
    "Merci d'avance.",
  ].join("\n");
}
