import mysql from "mysql2/promise";

const CLEAN = `
  c.slug NOT LIKE 'categorie-%'
  AND c.nom NOT REGEXP '^[0-9]+$'
  AND c.nom NOT LIKE 'CATEGORIE-%'
  AND LOWER(c.nom) NOT LIKE '%test%'
  AND c.nom NOT IN ('2023864', 'COUV.')
`;

const p = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sorel_local",
});

const [grouped] = await p.query(`
  SELECT COUNT(*) n FROM (
    SELECT a.libelle, a.categorie_id
    FROM catalogue_articles a
    INNER JOIN categories c ON c.id = a.categorie_id
    WHERE a.actif = 1 AND c.actif = 1 AND (${CLEAN})
    GROUP BY a.libelle, a.categorie_id
  ) t
`);
console.log("Grouped products:", grouped[0].n);

const [raw] = await p.query(`
  SELECT COUNT(*) n FROM catalogue_articles a
  INNER JOIN categories c ON c.id = a.categorie_id
  WHERE a.actif = 1 AND c.actif = 1 AND (${CLEAN})
`);
console.log("Raw rows:", raw[0].n);

const [terrine] = await p.query(`
  SELECT a.libelle,
         GROUP_CONCAT(DISTINCT a.variante ORDER BY a.variante SEPARATOR '|') vars,
         COUNT(DISTINCT a.variante) n
  FROM catalogue_articles a
  INNER JOIN categories c ON c.id = a.categorie_id
  WHERE a.actif = 1 AND c.slug = 'terrine' AND a.libelle = 'TERRINE RONDE'
  GROUP BY a.libelle
`);
console.log("TERRINE RONDE grouped:", terrine[0]);

await p.end();
