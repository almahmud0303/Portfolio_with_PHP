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

// Debug: Log the received input
error_log("Projects input received: " . json_encode($input));

// Validate required fields
if (!isset($input['title']) || !isset($input['description']) || !isset($input['category']) || !isset($input['technologies'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize and validate input
$title = trim($input['title']);
$description = trim($input['description']);
$category = trim($input['category']);
$image_url = isset($input['image_url']) ? trim($input['image_url']) : '';
$live_url = isset($input['live_url']) ? trim($input['live_url']) : '';
$source_code_url = isset($input['source_code_url']) ? trim($input['source_code_url']) : '';
$technologies = trim($input['technologies']);
$featured = isset($input['featured']) ? (bool)$input['featured'] : false;

// Validate category
$valid_categories = ['frontend', 'backend', 'fullstack', 'uiux'];
if (!in_array($category, $valid_categories)) {
    echo json_encode(['success' => false, 'message' => 'Invalid category']);
    exit;
}

// Validate URLs if provided
if ($image_url && !filter_var($image_url, FILTER_VALIDATE_URL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid image URL']);
    exit;
}

if ($live_url && !filter_var($live_url, FILTER_VALIDATE_URL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid live demo URL']);
    exit;
}

if ($source_code_url && !filter_var($source_code_url, FILTER_VALIDATE_URL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid source code URL']);
    exit;
}

try {
    // Include database connection
    require_once 'db_connect.php';
    
    // Check if connection is successful
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Check if project already exists
    $check_stmt = $conn->prepare("SELECT id FROM projects WHERE title = ? AND category = ?");
    $check_stmt->bind_param("ss", $title, $category);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Project already exists in this category']);
        exit;
    }
    
    // Insert new project
    $insert_stmt = $conn->prepare("
        INSERT INTO projects (title, description, category, image_url, live_url, source_code_url, technologies, featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insert_stmt->bind_param("sssssssi", $title, $description, $category, $image_url, $live_url, $source_code_url, $technologies, $featured);
    
    if ($insert_stmt->execute()) {
        $project_id = $conn->insert_id;
        
        echo json_encode([
            'success' => true, 
            'message' => 'Project added successfully!',
            'project_id' => $project_id,
            'data' => [
                'title' => $title,
                'description' => $description,
                'category' => $category,
                'image_url' => $image_url,
                'live_url' => $live_url,
                'source_code_url' => $source_code_url,
                'technologies' => $technologies,
                'featured' => $featured
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add project']);
    }
    
    $insert_stmt->close();
    
} catch (Exception $e) {
    error_log("Error adding project: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Database error occurred: ' . $e->getMessage(),
        'debug' => [
            'title' => $title,
            'description' => $description,
            'category' => $category,
            'image_url' => $image_url,
            'live_url' => $live_url,
            'source_code_url' => $source_code_url,
            'technologies' => $technologies,
            'featured' => $featured
        ]
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
