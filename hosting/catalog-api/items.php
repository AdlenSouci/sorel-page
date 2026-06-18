<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
allowGetOnly();

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
if ($slug === '') {
    sendJson(['error' => 'Slug manquant.'], 400);
    exit;
}

try {
    $catStmt = $pdo->prepare('SELECT id, nom, slug, ordre FROM categories WHERE slug = ? LIMIT 1');
    $catStmt->execute([$slug]);
    $category = $catStmt->fetch();

    if (!$category) {
        sendJson(['error' => 'Catégorie introuvable.'], 404);
        exit;
    }

    $itemsStmt = $pdo->prepare("
        SELECT id, code_article, libelle, variante, photo
        FROM catalogue
        WHERE categorie_id = ?
        ORDER BY libelle ASC, variante ASC
    ");
    $itemsStmt->execute([(int) $category['id']]);
    $items = $itemsStmt->fetchAll();

    $payload = [
        'category' => [
            'id' => (int) $category['id'],
            'nom' => $category['nom'],
            'slug' => $category['slug'],
            'ordre' => (int) $category['ordre'],
        ],
        'items' => array_map(static function (array $item) use ($category): array {
            $code = trim((string) ($item['code_article'] ?? ''));

            return [
                'id' => (int) $item['id'],
                'codeArticle' => $code !== '' ? $code : null,
                'libelle' => $item['libelle'],
                'variante' => $item['variante'],
                'photo' => $item['photo'],
                'categorySlug' => $category['slug'],
                'categoryNom' => $category['nom'],
            ];
        }, $items),
    ];

    sendJson($payload);
} catch (Throwable $e) {
    sendJson(['error' => 'Impossible de charger le catalogue.'], 500);
}
