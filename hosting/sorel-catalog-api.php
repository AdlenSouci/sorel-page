<?php

/**
 * À placer à la RACINE publique de sorel-order.fr (FileZilla → public_html/sorel-catalog-api.php)
 * Test : https://sorel-order.fr/sorel-catalog-api.php?action=categories
 *
 * Sur o2switch, l’hôte MySQL est en général 127.0.0.1 (pas sorel-order.fr).
 */
declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$config = [
    'host' => '127.0.0.1',
    'port' => 3306,
    'database' => 'kera6497_sorel-plastique',
    'username' => 'kera6497_sorel',
    'password' => 'y!a=b_@DDCYJ',
    'charset' => 'utf8mb4',
];

function sendJson(mixed $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}

$action = isset($_GET['action']) ? trim((string) $_GET['action']) : 'categories';

try {
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $config['host'],
        (int) $config['port'],
        $config['database'],
        $config['charset'],
    );
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Throwable $e) {
    sendJson(['error' => 'Connexion base impossible.'], 500);
    exit;
}

if ($action === 'categories') {
    try {
        $rows = $pdo->query("
            SELECT c.id, c.nom, c.slug, c.ordre, COUNT(ca.id) AS productCount
            FROM categories c
            LEFT JOIN catalogue ca ON ca.categorie_id = c.id
            GROUP BY c.id, c.nom, c.slug, c.ordre
            ORDER BY c.ordre ASC, c.nom ASC
        ")->fetchAll();
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
    exit;
}

if ($action === 'items') {
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
        sendJson([
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
        ]);
    } catch (Throwable $e) {
        sendJson(['error' => 'Impossible de charger le catalogue.'], 500);
    }
    exit;
}

if ($action === 'featured') {
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
    exit;
}

sendJson(['error' => 'Action inconnue.'], 400);
