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
if (!isset($input['name']) || !isset($input['category']) || !isset($input['proficiency_level'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize and validate input
$name = trim($input['name']);
$category = trim($input['category']);
$proficiency_level = intval($input['proficiency_level']);
$description = isset($input['description']) ? trim($input['description']) : '';
$display_order = isset($input['display_order']) ? intval($input['display_order']) : 1;

// Validate proficiency level
if ($proficiency_level < 1 || $proficiency_level > 100) {
    echo json_encode(['success' => false, 'message' => 'Proficiency level must be between 1 and 100']);
    exit;
}

// Validate category
$valid_categories = ['frontend', 'backend', 'fullstack', 'uiux', 'soft'];
if (!in_array($category, $valid_categories)) {
    echo json_encode(['success' => false, 'message' => 'Invalid category']);
    exit;
}

// Map frontend category values to database category names
$category_mapping = [
    'frontend' => 'Frontend',
    'backend' => 'Backend', 
    'fullstack' => 'Fullstack',
    'uiux' => 'UI/UX',
    'soft' => 'Soft Skills'
];

$category_name = $category_mapping[$category];

try {
    // Include database connection
    require_once 'db_connect.php';
    
    // Check if connection is successful
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Get category ID from category name
    $category_stmt = $conn->prepare("SELECT id FROM skill_categories WHERE name = ?");
    $category_stmt->bind_param("s", $category_name);
    $category_stmt->execute();
    $category_result = $category_stmt->get_result();
    
    if ($category_result->num_rows === 0) {
        // Category doesn't exist, create it
        $insert_category_stmt = $conn->prepare("INSERT INTO skill_categories (name, description, display_order) VALUES (?, ?, ?)");
        $display_order = array_search($category, $valid_categories) + 1;
        $description = "Skills related to " . strtolower($category_name);
        $insert_category_stmt->bind_param("ssi", $category_name, $description, $display_order);
        
        if ($insert_category_stmt->execute()) {
            $category_id = $conn->insert_id;
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create category']);
            exit;
        }
        $insert_category_stmt->close();
    } else {
        $category_row = $category_result->fetch_assoc();
        $category_id = $category_row['id'];
    }
    $category_stmt->close();
    
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
                'category' => $category,
                'category_name' => $category_name,
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
