import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      title: "Color Tonic — Rose pastel",
      slug: "color-tonic-rose",
      category: "Color Tonic",
      description:
        "Teinte douce pour pièces intérieures, finition satinée résistante à l’humidité.",
      imageUrl: null,
      sortOrder: 0,
    },
    {
      title: "Color Tonic — Ambre",
      slug: "color-tonic-ambre",
      category: "Color Tonic",
      description:
        "Chaleur ambre pour façades ou pièces à vivre ; excellent rendu sous lumière naturelle.",
      imageUrl: null,
      sortOrder: 1,
    },
    {
      title: "Color Tonic — Ciel",
      slug: "color-tonic-ciel",
      category: "Color Tonic",
      description:
        "Bleu ciel léger, idéal bureaux et espaces commerciaux. Faible VOC.",
      imageUrl: null,
      sortOrder: 2,
    },
    {
      title: "Color Tonic — Lagon",
      slug: "color-tonic-lagon",
      category: "Color Tonic",
      description:
        "Teinte lagon équilibrée pour signalétique et accents architecturaux.",
      imageUrl: null,
      sortOrder: 3,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
