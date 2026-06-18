import mysql from "mysql2/promise";

const p = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sorel_local",
});

const [dupLibelle] = await p.query(`
  SELECT libelle, variante, COUNT(*) n, GROUP_CONCAT(id) ids
  FROM catalogue_articles
  WHERE actif = 1
  GROUP BY libelle, variante, categorie_id
  HAVING n > 1
  ORDER BY n DESC
  LIMIT 15
`);
console.log("Duplicates same libelle+variante+categorie:", dupLibelle.length);
dupLibelle.forEach((r) => console.log(r.n, r.libelle, r.variante, r.ids));

const [dupCrossCat] = await p.query(`
  SELECT a.libelle, a.variante, COUNT(DISTINCT a.categorie_id) cats, COUNT(*) n
  FROM catalogue_articles a
  WHERE a.actif = 1
  GROUP BY a.libelle, a.variante
  HAVING n > 1
  ORDER BY n DESC
  LIMIT 15
`);
console.log("\nSame libelle+variante in multiple rows:");
dupCrossCat.forEach((r) => console.log(r.n, r.cats, "cats", r.libelle, r.variante));

const [sample] = await p.query(`
  SELECT id, libelle, variante, categorie_id, code_article
  FROM catalogue_articles
  WHERE actif = 1 AND libelle LIKE '%TERRINE%'
  ORDER BY libelle, variante
  LIMIT 20
`);
console.log("\nSample TERRINE rows:");
sample.forEach((r) => console.log(r.id, r.categorie_id, r.code_article, r.libelle, r.variante));

const [tables] = await p.query("SHOW TABLES LIKE '%categor%'");
console.log("\nTables with categor:", tables);

await p.end();
