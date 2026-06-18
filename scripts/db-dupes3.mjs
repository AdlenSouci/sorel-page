import mysql from "mysql2/promise";

const p = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sorel_local",
});

const [r] = await p.query(`
  SELECT id, libelle, variante, code_article
  FROM catalogue_articles WHERE code_article LIKE '500R%' AND actif = 1
`);
console.log("500R rows:", r);

const [r2] = await p.query(`
  SELECT code_article, COUNT(*) n
  FROM catalogue_articles WHERE actif = 1
  GROUP BY code_article HAVING n > 1 LIMIT 10
`);
console.log("Duplicate code_article:", r2);

await p.end();
