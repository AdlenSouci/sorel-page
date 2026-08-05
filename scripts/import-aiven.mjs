/**
 * Importe scripts/out/sorel-article-cloud.sql vers MySQL distant (Aiven).
 *
 * Variables : DB_HOST, DB_PORT, DB_USERNAME (ou DB_USER), DB_PASSWORD, DB_DATABASE (ou DB_NAME)
 * Optionnel : DB_SSL_CA (contenu PEM) ou laisser vide (TLS sans vérif CA)
 *
 * Usage :
 *   # PowerShell
 *   $env:DB_HOST="mysql-xxxxx.i.aivencloud.com"
 *   $env:DB_PORT="19534"
 *   $env:DB_USERNAME="avnadmin"
 *   $env:DB_PASSWORD="..."
 *   $env:DB_DATABASE="defaultdb"
 *   node scripts/import-aiven.mjs
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const SQL_FILE = path.join("scripts", "out", "sorel-article-cloud.sql");

if (!fs.existsSync(SQL_FILE)) {
  console.error("Fichier manquant :", SQL_FILE);
  console.error("Lancez d'abord : node scripts/export-article-cloud.mjs");
  process.exit(1);
}

const host = process.env.DB_HOST?.trim();
const user = process.env.DB_USER || process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME || process.env.DB_DATABASE || "defaultdb";

if (!host || !user || password === undefined) {
  console.error("DB_HOST, DB_USERNAME et DB_PASSWORD requis.");
  process.exit(1);
}

let ca = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");
const caFile = path.join("certs", "aiven-ca.pem");
if (!ca && fs.existsSync(caFile)) {
  ca = fs.readFileSync(caFile, "utf8");
}
const ssl = ca
  ? { ca, rejectUnauthorized: true }
  : host.includes("aivencloud.com") || process.env.DB_SSL === "1"
    ? { rejectUnauthorized: false }
    : undefined;

const conn = await mysql.createConnection({
  host,
  port: Number(process.env.DB_PORT || 3306),
  user,
  password,
  database,
  ssl,
  multipleStatements: true,
});

console.log("Connexion OK →", host);
const sql = fs.readFileSync(SQL_FILE, "utf8");
await conn.query(sql);

const [[arts]] = await conn.query("SELECT COUNT(*) AS n FROM article");
const [[gammes]] = await conn.query(
  "SELECT COUNT(DISTINCT gamme) AS n FROM article WHERE gamme IS NOT NULL AND TRIM(gamme) != ''",
);
console.log(`Import OK : ${arts.n} articles, ${gammes.n} gammes dans \`article\``);

await conn.end();
