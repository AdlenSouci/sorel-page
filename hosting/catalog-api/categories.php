<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
allowGetOnly();

try {
    $stmt = $pdo->query("
        SELECT
            c.id,
            c.nom,
            c.slug,
            c.ordre,
            COUNT(ca.id) AS productCount
        FROM categories c
        LEFT JOIN catalogue ca ON ca.categorie_id = c.id
        GROUP BY c.id, c.nom, c.slug, c.ordre
        ORDER BY c.ordre ASC, c.nom ASC
    ");

    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['id'] = (int) $row['id'];
        $row['ordre'] = (int) $row['ordre'];
        $row['productCount'] = (int) $row['productCount'];
    }
    unset($row);

    sendJson($rows);
} catch (Throwable $e) {
    sendJson(['error' => 'Impossible de charger les catégories.'], 500);
}
