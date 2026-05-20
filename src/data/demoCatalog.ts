import type { ProductDTO } from "../types/product";

/** Liste locale tant qu’aucune API / base de données n’est branchée. */
export const DEMO_CATALOG: ProductDTO[] = [
  {
    id: "demo-color-tonic-rose",
    title: "Color Tonic — Rose pastel",
    slug: "color-tonic-rose",
    category: "Color Tonic",
    description:
      "Teinte douce pour pièces intérieures, finition satinée résistante à l’humidité.",
    imageUrl: null,
    sortOrder: 0,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
  },
  {
    id: "demo-color-tonic-ambre",
    title: "Color Tonic — Ambre",
    slug: "color-tonic-ambre",
    category: "Color Tonic",
    description:
      "Chaleur ambre pour façades ou pièces à vivre ; excellent rendu sous lumière naturelle.",
    imageUrl: null,
    sortOrder: 1,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
  },
  {
    id: "demo-color-tonic-ciel",
    title: "Color Tonic — Ciel",
    slug: "color-tonic-ciel",
    category: "Color Tonic",
    description:
      "Bleu ciel léger, idéal bureaux et espaces commerciaux. Faible VOC.",
    imageUrl: null,
    sortOrder: 2,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
  },
  {
    id: "demo-color-tonic-lagon",
    title: "Color Tonic — Lagon",
    slug: "color-tonic-lagon",
    category: "Color Tonic",
    description:
      "Teinte lagon équilibrée pour signalétique et accents architecturaux.",
    imageUrl: null,
    sortOrder: 3,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
  },
];
