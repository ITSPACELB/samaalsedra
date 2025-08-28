<?php
// 🔥 Backend API لـ OpenAI Chat
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// 🔑 قراءة API Key من ملف .env
function loadEnv() {
    $envFile = __DIR__ . '/.env';
    if (!file_exists($envFile)) {
        throw new Exception('.env file not found');
    }
    
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && !str_starts_with($line, '#')) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value, '"\'');
        }
    }
}

// تحميل متغيرات البيئة
loadEnv();
$OPENAI_API_KEY = $_ENV['VITE_OPENAI_API_KEY'] ?? null;

if (!$OPENAI_API_KEY) {
    http_response_code(500);
    echo json_encode(['error' => 'API Key not found in .env file']);
    exit();
}

// قراءة البيانات من الطلب
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['messages'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit();
}

$messages = $input['messages'];

// إعداد البيانات لـ OpenAI
$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => $messages,
    'max_tokens' => 800,
    'temperature' => 0.5
];

// إرسال الطلب إلى OpenAI
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://api.openai.com/v1/chat/completions',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $OPENAI_API_KEY
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// التحقق من الأخطاء
if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection error: ' . $error]);
    exit();
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'OpenAI API error', 'status' => $httpCode, 'response' => $response]);
    exit();
}

// إرجاع الاستجابة
echo $response;
?>