import fs from "node:fs";

const input = "C:/Users/adlen/Downloads/kera6497_sorel-plastique.sql";
const output = "C:/Users/adlen/Downloads/kera6497_sorel-plastique_fixed.sql";

let sql = fs.readFileSync(input, "utf8");

const catIds = new Set();
const artCatIds = new Set();

for (const m of sql.matchAll(/INSERT INTO `categories`[^;]+;/gs)) {
  for (const id of m[0].matchAll(/\((\d+), '/g)) catIds.add(Number(id[1]));
}

for (const m of sql.matchAll(/INSERT INTO `catalogue_articles`[^;]+;/gs)) {
  for (const row of m[0].matchAll(/\(\d+, (\d+|NULL), '/g)) {
    if (row[1] !== "NULL") artCatIds.add(Number(row[1]));
  }
}

const orphans = [...artCatIds].filter((id) => !catIds.has(id)).sort((a, b) => a - b);
const ts = "2026-05-26 17:26:08";

if (orphans.length) {
  const stubRows = orphans
    .map(
      (id) =>
        `(${id}, 'CATEGORIE-${id}', 'categorie-${id}', ${id}, 1, '${ts}', '${ts}')`,
    )
    .join(",\n");

  sql = sql.replace(
    "(81, 'VERRINE', 'verrine', 81, 1, '2026-05-26 17:26:08', '2026-05-26 17:26:08');",
    `(81, 'VERRINE', 'verrine', 81, 1, '${ts}', '${ts}'),\n${stubRows};`,
  );
}

if (!sql.includes("SET FOREIGN_KEY_CHECKS = 0")) {
  sql = sql.replace(
    'SET time_zone = "+00:00";',
    'SET time_zone = "+00:00";\n\nSET FOREIGN_KEY_CHECKS = 0;',
  );
}

if (!sql.includes("SET FOREIGN_KEY_CHECKS = 1")) {
  sql = sql.replace("COMMIT;", "SET FOREIGN_KEY_CHECKS = 1;\nCOMMIT;");
}

sql = sql.replace(
  /-- Base de données : `kera6497_sorel-plastique`/,
  "-- Base de données : `sorel_local`",
);

if (!sql.includes("USE `sorel_local`")) {
  sql = sql.replace(
    /\/\*!40101 SET NAMES utf8mb4 \*\/;\s*/,
    "/*!40101 SET NAMES utf8mb4 */;\n\nUSE `sorel_local`;\n\n",
  );
}

fs.writeFileSync(output, sql, "utf8");
console.log(`OK -> ${output}`);
console.log(`Categories manquantes ajoutees: ${orphans.length}`);
