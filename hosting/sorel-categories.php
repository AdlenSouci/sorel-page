<?php
/**
 * À placer dans le dossier public du site (même endroit que index.php Laravel).
 * URL : https://sorel-order.fr/sorel-categories.php
 *
 * Copie host / base / user / password depuis ton .env Laravel.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$database = 'kera6497_sorel-plastique';
$username = 'kera6497_sorel';
$password = 'METS_TON_MOT_DE_PASSE_ICI';

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$database};charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $sql = <<<'SQL'
        SELECT c.id, c.nom, c.slug, c.ordre, COUNT(ca.id) AS productCount
        FROM categories c
        LEFT JOIN catalogue ca ON ca.categorie_id = c.id
        GROUP BY c.id, c.nom, c.slug, c.ordre
        ORDER BY c.ordre, c.nom
    SQL;

    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
