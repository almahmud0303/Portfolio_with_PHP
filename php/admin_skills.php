<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['name']) || !isset($input['category_id']) || !isset($input['proficiency_level'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize and validate input
$name = trim($input['name']);
$category_id = intval($input['category_id']);
$proficiency_level = intval($input['proficiency_level']);
$description = isset($input['description']) ? trim($input['description']) : '';
$display_order = isset($input['display_order']) ? intval($input['display_order']) : 1;

// Validate proficiency level
if ($proficiency_level < 1 || $proficiency_level > 100) {
    echo json_encode(['success' => false, 'message' => 'Proficiency level must be between 1 and 100']);
    exit;
}

// Validate category_id
if ($category_id < 1) {
    echo json_encode(['success' => false, 'message' => 'Invalid category ID']);
    exit;
}

try {
    // Include database connection
    require_once 'db_connect.php';
    
    // Check if skill already exists
    $check_stmt = $conn->prepare("SELECT id FROM skills WHERE name = ? AND category_id = ?");
    $check_stmt->bind_param("si", $name, $category_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Skill already exists in this category']);
        exit;
    }
    
    // Insert new skill
    $insert_stmt = $conn->prepare("INSERT INTO skills (name, category_id, proficiency_level, description, display_order) VALUES (?, ?, ?, ?, ?)");
    $insert_stmt->bind_param("siisi", $name, $category_id, $proficiency_level, $description, $display_order);
    
    if ($insert_stmt->execute()) {
        $skill_id = $conn->insert_id;
        
        echo json_encode([
            'success' => true, 
            'message' => 'Skill added successfully!',
            'skill_id' => $skill_id,
            'data' => [
                'name' => $name,
                'category_id' => $category_id,
                'proficiency_level' => $proficiency_level,
                'description' => $description,
                'display_order' => $display_order
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add skill']);
    }
    
    $insert_stmt->close();
    
} catch (Exception $e) {
    error_log("Error adding skill: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
