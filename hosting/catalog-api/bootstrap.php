<?php

declare(strict_types=1);

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'config.php manquant. Copiez config.example.php → config.php']);
    exit;
}

/** @var array{host:string,port:int,database:string,username:string,password:string,charset?:string} $config */
$config = require $configFile;

$charset = $config['charset'] ?? 'utf8mb4';
$dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
    $config['host'],
    (int) $config['port'],
    $config['database'],
    $charset,
);

$pdo = new PDO($dsn, $config['username'], $config['password'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

function sendJson(mixed $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}

function allowGetOnly(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendJson(['error' => 'Method not allowed'], 405);
        exit;
    }
}
