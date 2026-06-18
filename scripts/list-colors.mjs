import mysql from "mysql2/promise";

const p = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sorel_local",
});

const [r] = await p.query(`
  SELECT variante, COUNT(DISTINCT CONCAT(categorie_id,'|',libelle)) n
  FROM catalogue_articles
  WHERE actif = 1 AND variante IS NOT NULL AND TRIM(variante) != ''
  GROUP BY variante ORDER BY n DESC
`);
console.log(r.length, "couleurs total");
r.forEach((x) => console.log(x.n, x.variante));

await p.end();
