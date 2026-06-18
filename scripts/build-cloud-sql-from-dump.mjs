/**
 * Génère scripts/out/sorel-catalog-cloud.sql depuis un dump MySQL
 * (sans MySQL local). Compatible API Vercel (table `catalogue`).
 */
import fs from "node:fs";
import path from "node:path";

const INPUT =
  process.argv[2] ||
  "C:/Users/adlen/Downloads/kera6497_sorel-plastique_fixed.sql";
const OUT = path.join("scripts", "out", "sorel-catalog-cloud.sql");

if (!fs.existsSync(INPUT)) {
  console.error("Dump introuvable :", INPUT);
  process.exit(1);
}

const sql = fs.readFileSync(INPUT, "utf8");

const catCreateRaw = sql.match(/CREATE TABLE `categories`[\s\S]*?;/)?.[0];
if (!catCreateRaw) {
  console.error("Table categories introuvable.");
  process.exit(1);
}

/** Aiven exige une PRIMARY KEY sur chaque table */
const catCreate = catCreateRaw
  .replace(
    "`id` int(10) UNSIGNED NOT NULL,",
    "`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,",
  )
  .replace(
    ") ENGINE=InnoDB",
    ", PRIMARY KEY (`id`), UNIQUE KEY `categories_slug_unique` (`slug`)\n) ENGINE=InnoDB",
  );
const catInsert = sql.match(/INSERT INTO `categories`[\s\S]*?;/)?.[0];
const artInsert = sql.match(/INSERT INTO `catalogue_articles`[\s\S]*?;/)?.[0];

if (!catInsert || !artInsert) {
  console.error("categories ou catalogue_articles manquants dans le dump.");
  process.exit(1);
}

const catalogueCreate = `
CREATE TABLE \`catalogue\` (
  \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
  \`categorie_id\` int(10) unsigned NOT NULL,
  \`code_article\` varchar(50) DEFAULT NULL,
  \`libelle\` varchar(255) NOT NULL,
  \`variante\` varchar(100) DEFAULT NULL,
  \`photo\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_catalogue_categorie\` (\`categorie_id\`),
  CONSTRAINT \`fk_catalogue_categorie\` FOREIGN KEY (\`categorie_id\`) REFERENCES \`categories\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`.trim();

/** (id, categorie_id, code, libelle, variante, photo, ...) → INSERT catalogue */
function mapArticles(insertSql) {
  const rows = [];
  const re = /\((\d+), (\d+), '([^']*)', '([^']*)', (NULL|'[^']*'), (NULL|'[^']*'),/g;
  let m;
  while ((m = re.exec(insertSql)) !== null) {
    const [, id, catId, code, libelle, variante, photo] = m;
    rows.push(
      `(${id}, ${catId}, '${code.replace(/'/g, "''")}', '${libelle.replace(/'/g, "''")}', ${variante}, ${photo})`,
    );
  }
  return rows;
}

const articleRows = mapArticles(artInsert);
const activeOnly = artInsert.includes("`actif`");

let catalogueInsert = "";
if (articleRows.length) {
  catalogueInsert = `INSERT INTO \`catalogue\` (\`id\`, \`categorie_id\`, \`code_article\`, \`libelle\`, \`variante\`, \`photo\`) VALUES\n${articleRows.join(",\n")};`;
}

const out = [
  "-- sorel_page — export catalogue cloud (depuis dump)",
  "SET NAMES utf8mb4;",
  "SET FOREIGN_KEY_CHECKS = 0;",
  "DROP TABLE IF EXISTS `catalogue`;",
  "DROP TABLE IF EXISTS `catalogue_articles`;",
  "DROP TABLE IF EXISTS `categories`;",
  "",
  catCreate,
  "",
  catalogueCreate,
  "",
  catInsert,
  "",
  catalogueInsert,
  "",
  "SET FOREIGN_KEY_CHECKS = 1;",
  "",
].join("\n");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, "utf8");

const catCount = (catInsert.match(/\(\d+,/g) || []).length;
console.log(`OK → ${OUT}`);
console.log(`${catCount} catégories, ${articleRows.length} articles → table catalogue`);
