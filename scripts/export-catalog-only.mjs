/**
 * Export minimal pour DB cloud (TiDB, Railway MySQL, o2switch…).
 * Tables : categories + catalogue (renommée depuis catalogue_articles).
 *
 * Usage : node scripts/export-catalog-only.mjs
 * Sortie : scripts/out/sorel-catalog-cloud.sql
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const OUT_DIR = path.join("scripts", "out");
const OUT_FILE = path.join(OUT_DIR, "sorel-catalog-cloud.sql");

const host = process.env.DB_HOST || "localhost";
const ca = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");
const ssl = ca
  ? { ca, rejectUnauthorized: true }
  : host.includes("aivencloud.com")
    ? { rejectUnauthorized: true }
    : undefined;

const pool = await mysql.createPool({
  host,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || process.env.DB_DATABASE || "sorel_local",
  ssl,
});

const [tables] = await pool.query("SHOW TABLES LIKE 'catalogue_articles'");
if (!tables.length) {
  console.error("Table catalogue_articles introuvable dans", process.env.DB_NAME || "sorel_local");
  process.exit(1);
}

const lines = [
  "-- sorel_page — export catalogue cloud",
  "-- Importer dans phpMyAdmin, TiDB Console ou client MySQL",
  "SET NAMES utf8mb4;",
  "SET FOREIGN_KEY_CHECKS = 0;",
  "",
  "DROP TABLE IF EXISTS `catalogue`;",
  "DROP TABLE IF EXISTS `catalogue_articles`;",
  "DROP TABLE IF EXISTS `categories`;",
  "",
];

const [catDdl] = await pool.query("SHOW CREATE TABLE categories");
lines.push(String(catDdl[0]["Create Table"]) + ";", "");

lines.push(`
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
`.trim(), "");

const [cats] = await pool.query("SELECT * FROM categories ORDER BY id");
if (cats.length) {
  const cols = Object.keys(cats[0]);
  const values = cats
    .map((row) => {
      const vals = cols.map((c) => pool.escape(row[c]));
      return `(${vals.join(", ")})`;
    })
    .join(",\n");
  lines.push(`INSERT INTO \`categories\` (\`${cols.join("`, `")}\`) VALUES\n${values};`, "");
}

const [arts] = await pool.query(`
  SELECT id, categorie_id, code_article, libelle, variante, photo
  FROM catalogue_articles
  WHERE actif = 1
  ORDER BY id
`);

if (arts.length) {
  const chunks = [];
  for (const row of arts) {
    chunks.push(
      `(${[
        row.id,
        row.categorie_id,
        pool.escape(row.code_article),
        pool.escape(row.libelle),
        pool.escape(row.variante),
        pool.escape(row.photo),
      ].join(", ")})`,
    );
  }
  lines.push(
    "INSERT INTO `catalogue` (`id`, `categorie_id`, `code_article`, `libelle`, `variante`, `photo`) VALUES",
    chunks.join(",\n") + ";",
    "",
  );
}

lines.push("SET FOREIGN_KEY_CHECKS = 1;", "");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf8");

const kb = Math.round(fs.statSync(OUT_FILE).size / 1024);
console.log(`OK → ${OUT_FILE}`);
console.log(`${cats.length} catégories, ${arts.length} articles (~${kb} Ko)`);

await pool.end();
