/**
 * Au build Vercel : lit categories → src/data/categories.prod.json
 * (inclus dans le JS du site, pas de fichier séparé)
 */
import fs from "fs";
import mysql from "mysql2/promise";

const OUT = "src/data/categories.prod.json";

const SQL = `
  SELECT c.id, c.nom, c.slug, c.ordre, COUNT(ca.id) AS productCount
  FROM categories c
  LEFT JOIN catalogue ca ON ca.categorie_id = c.id
  GROUP BY c.id, c.nom, c.slug, c.ordre
  ORDER BY c.ordre, c.nom
`;

fs.mkdirSync("src/data", { recursive: true });

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL manquant — categories.prod.json = []");
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, "[]");
  process.exit(0);
}

try {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.execute(SQL);
  await conn.end();
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 2));
  console.log(`OK : ${rows.length} catégorie(s) → ${OUT}`);
} catch (err) {
  console.error("ERREUR lecture base :", err.message);
  process.exit(1);
}
