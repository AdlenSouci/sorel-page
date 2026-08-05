/**
 * Exporte la table `article` (catalogue_sorel) vers scripts/out/sorel-article-cloud.sql
 * pour import Aiven / MySQL distant.
 *
 * Usage (local) :
 *   node scripts/export-article-cloud.mjs
 *
 * Variables optionnelles : DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const OUT_DIR = path.join("scripts", "out");
const OUT_FILE = path.join(OUT_DIR, "sorel-article-cloud.sql");

const host = process.env.DB_HOST || "localhost";
const ca = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");
const ssl = ca
  ? { ca, rejectUnauthorized: true }
  : host.includes("aivencloud.com")
    ? { rejectUnauthorized: false }
    : undefined;

const pool = await mysql.createPool({
  host,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || process.env.DB_DATABASE || "catalogue_sorel",
  ssl,
});

const [tables] = await pool.query("SHOW TABLES LIKE 'article'");
if (!tables.length) {
  console.error(
    "Table article introuvable dans",
    process.env.DB_NAME || process.env.DB_DATABASE || "catalogue_sorel",
  );
  process.exit(1);
}

const [createRows] = await pool.query("SHOW CREATE TABLE article");
const createSql = createRows[0]["Create Table"];

const [rows] = await pool.query("SELECT * FROM article");
const columns = rows.length
  ? Object.keys(rows[0])
  : (
      await pool.query(
        "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'article' ORDER BY ORDINAL_POSITION",
      )
    )[0].map((r) => r.COLUMN_NAME);

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  if (Buffer.isBuffer(value)) {
    return `X'${value.toString("hex")}'`;
  }
  if (value instanceof Date) {
    const iso = value.toISOString().slice(0, 19).replace("T", " ");
    return mysql.escape(iso);
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "boolean") return value ? "1" : "0";
  return mysql.escape(String(value));
}

const lines = [
  "-- sorel_page — export table article pour Aiven",
  "SET NAMES utf8mb4;",
  "SET FOREIGN_KEY_CHECKS = 0;",
  "DROP TABLE IF EXISTS `article`;",
  `${createSql};`,
  "",
];

if (rows.length) {
  const colList = columns.map((c) => `\`${c}\``).join(", ");
  const chunkSize = 50;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const values = chunk
      .map(
        (row) =>
          `(${columns.map((c) => sqlLiteral(row[c])).join(", ")})`,
      )
      .join(",\n");
    lines.push(`INSERT INTO \`article\` (${colList}) VALUES\n${values};`);
    lines.push("");
  }
}

lines.push("SET FOREIGN_KEY_CHECKS = 1;");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
console.log(`OK → ${OUT_FILE} (${rows.length} lignes)`);
await pool.end();
