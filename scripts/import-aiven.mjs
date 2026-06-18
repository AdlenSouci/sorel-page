/**
 * Importe scripts/out/sorel-catalog-cloud.sql vers MySQL distant (Aiven).
 *
 * Variables : DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
 * Optionnel : DB_SSL_CA (contenu PEM) ou DB_SSL=1
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const SQL_FILE = path.join("scripts", "out", "sorel-catalog-cloud.sql");

if (!fs.existsSync(SQL_FILE)) {
  console.error("Fichier manquant :", SQL_FILE);
  console.error("Lancez d'abord : node scripts/export-catalog-only.mjs");
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
  : host.includes("aivencloud.com")
    ? { rejectUnauthorized: true }
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

const [[cats]] = await conn.query("SELECT COUNT(*) AS n FROM categories");
const [[arts]] = await conn.query("SELECT COUNT(*) AS n FROM catalogue");
console.log(`Import OK : ${cats.n} catégories, ${arts.n} articles dans \`catalogue\``);

await conn.end();
