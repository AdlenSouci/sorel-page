import mysql from "mysql2/promise";

const p = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sorel_local",
});

const [cats] = await p.query(`
  SELECT c.nom, c.slug, COUNT(a.id) n
  FROM categories c
  INNER JOIN catalogue_articles a ON a.categorie_id = c.id AND a.actif = 1
  WHERE c.actif = 1
    AND c.slug NOT LIKE 'categorie-%'
    AND c.nom NOT REGEXP '^[0-9]+$'
    AND c.nom NOT LIKE 'CATEGORIE-%'
    AND LOWER(c.nom) NOT LIKE '%test%'
    AND c.nom NOT IN ('2023864', 'COUV.')
  GROUP BY c.id
  ORDER BY c.ordre ASC, c.nom ASC
`);
console.log("Clean categories with articles:", cats.length);
cats.forEach((r) => console.log(`  ${r.n}  ${r.nom}`));

const [vars] = await p.query(`
  SELECT variante, COUNT(*) n FROM catalogue_articles
  WHERE actif = 1 AND variante IS NOT NULL AND variante != ''
  GROUP BY variante ORDER BY n DESC LIMIT 20
`);
console.log("\nVariantes:", vars);

await p.end();
