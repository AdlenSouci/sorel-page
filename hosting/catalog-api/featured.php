<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
allowGetOnly();

$limit = isset($_GET['limit']) ? max(1, min(12, (int) $_GET['limit'])) : 4;

try {
    $stmt = $pdo->prepare("
        SELECT
            ca.id,
            ca.code_article,
            ca.libelle,
            ca.variante,
            ca.photo,
            c.slug AS categorySlug,
            c.nom AS categoryNom
        FROM catalogue ca
        INNER JOIN categories c ON c.id = ca.categorie_id
        ORDER BY ca.id DESC
        LIMIT ?
    ");
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    sendJson(array_map(static function (array $item): array {
        $code = trim((string) ($item['code_article'] ?? ''));
        return [
            'id' => (int) $item['id'],
            'codeArticle' => $code !== '' ? $code : null,
            'libelle' => $item['libelle'],
            'variante' => $item['variante'],
            'photo' => $item['photo'],
            'categorySlug' => $item['categorySlug'],
            'categoryNom' => $item['categoryNom'],
        ];
    }, $rows));
} catch (Throwable $e) {
    sendJson(['error' => 'Impossible de charger les articles.'], 500);
}
