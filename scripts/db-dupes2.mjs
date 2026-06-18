import mysql from "mysql2/promise";

const p = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sorel_local",
});

const [sameLibelle] = await p.query(`
  SELECT libelle, categorie_id, COUNT(*) n, GROUP_CONCAT(DISTINCT variante) vars
  FROM catalogue_articles WHERE actif = 1
  GROUP BY libelle, categorie_id HAVING n > 1
  ORDER BY n DESC LIMIT 20
`);
console.log("Same libelle in same category:", sameLibelle.length);
sameLibelle.forEach((r) => console.log(r.n, r.libelle, r.vars));

const [baseName] = await p.query(`
  SELECT 
    REGEXP_REPLACE(libelle, ' (BLANC|NOIR|VERT|BEIGE|ROUGE|BLEU|GRIS|MARRON|ROSE|JAUNE|ORANGE|NATUREL|CRISTAL).*$', '') base,
    categorie_id,
    COUNT(*) n
  FROM catalogue_articles WHERE actif = 1
  GROUP BY base, categorie_id HAVING n > 3
  ORDER BY n DESC LIMIT 15
`);
console.log("\nSimilar base names (3+ variants):");
baseName.forEach((r) => console.log(r.n, r.base));

const [emptyVarSameLib] = await p.query(`
  SELECT libelle, COUNT(*) n FROM catalogue_articles
  WHERE actif = 1 AND (variante IS NULL OR variante = '')
  GROUP BY libelle HAVING n > 1 LIMIT 15
`);
console.log("\nSame libelle, no variante:", emptyVarSameLib.length);
emptyVarSameLib.forEach((r) => console.log(r.n, r.libelle));

const [overlapArticles] = await p.query(`
  SELECT ca.libelle, ca.code_article, a.Libelle_1, a.Code_Article
  FROM catalogue_articles ca
  LEFT JOIN articles a ON a.Code_Article = ca.code_article
  WHERE ca.actif = 1
  LIMIT 5
`);
console.log("\nJoin catalogue vs articles:", overlapArticles);

const [totalDistinct] = await p.query(`
  SELECT COUNT(*) total, COUNT(DISTINCT libelle) distinct_lib,
         COUNT(DISTINCT CONCAT(libelle,'|',IFNULL(variante,''))) distinct_combo
  FROM catalogue_articles WHERE actif = 1
`);
console.log("\nTotals:", totalDistinct[0]);

await p.end();
