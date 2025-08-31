<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        exit;
    }
    
    // Validate required fields
    if (empty($input['title']) || empty($input['drive_link'])) {
        echo json_encode(['success' => false, 'error' => 'Title and Drive link are required']);
        exit;
    }
    
    // Sanitize inputs
    $title = htmlspecialchars(trim($input['title']), ENT_QUOTES, 'UTF-8');
    $description = htmlspecialchars(trim($input['description'] ?? ''), ENT_QUOTES, 'UTF-8');
    $drive_link = filter_var(trim($input['drive_link']), FILTER_SANITIZE_URL);
    $category = htmlspecialchars(trim($input['category'] ?? 'General'), ENT_QUOTES, 'UTF-8');
    
    // Validate URL
    if (!filter_var($drive_link, FILTER_VALIDATE_URL)) {
        echo json_encode(['success' => false, 'error' => 'Invalid Drive link URL']);
        exit;
    }
    
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=portfolio_db", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Insert photo
    $stmt = $pdo->prepare("
        INSERT INTO photo_gallery (title, description, drive_link, category) 
        VALUES (:title, :description, :drive_link, :category)
    ");
    
    $stmt->execute([
        ':title' => $title,
        ':description' => $description,
        ':drive_link' => $drive_link,
        ':category' => $category
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Photo added successfully',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>
