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
error_log("Education input received: " . json_encode($input));

// Validate required fields
if (!isset($input['degree']) || !isset($input['institution']) || !isset($input['start_date']) || !isset($input['description'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize and validate input
$degree = trim($input['degree']);
$institution = trim($input['institution']);
$location = isset($input['location']) ? trim($input['location']) : '';
$field_of_study = isset($input['fieldOfStudy']) ? trim($input['fieldOfStudy']) : '';
$start_date = $input['start_date'];
$end_date = isset($input['end_date']) && !empty($input['end_date']) ? $input['end_date'] : null;
$duration = isset($input['duration']) ? trim($input['duration']) : '';
$gpa = isset($input['gpa']) && !empty($input['gpa']) ? floatval($input['gpa']) : null;
$description = trim($input['description']);
$achievements = isset($input['achievements']) ? trim($input['achievements']) : '';

// Validate dates
if (!strtotime($start_date)) {
    echo json_encode(['success' => false, 'message' => 'Invalid start date']);
    exit;
}

if ($end_date && !strtotime($end_date)) {
    echo json_encode(['success' => false, 'message' => 'Invalid end date']);
    exit;
}

// Validate GPA if provided
if ($gpa !== null && ($gpa < 0 || $gpa > 5)) {
    echo json_encode(['success' => false, 'message' => 'GPA must be between 0 and 5']);
    exit;
}

// Note: Duration field removed as it doesn't exist in database

try {
    // Include database connection
    require_once 'db_connect.php';
    
    // Check if connection is successful
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Check if education entry already exists
    $check_stmt = $conn->prepare("SELECT id FROM education WHERE degree = ? AND institution = ? AND start_date = ?");
    $check_stmt->bind_param("sss", $degree, $institution, $start_date);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Education entry already exists']);
        exit;
    }
    
    // Insert new education entry
    $insert_stmt = $conn->prepare("
        INSERT INTO education (degree, institution, field_of_study, start_date, end_date, gpa, description, achievements) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insert_stmt->bind_param("sssssdss", $degree, $institution, $field_of_study, $start_date, $end_date, $gpa, $description, $achievements);
    
    if ($insert_stmt->execute()) {
        $education_id = $conn->insert_id;
        
        echo json_encode([
            'success' => true, 
            'message' => 'Education entry added successfully!',
            'education_id' => $education_id,
            'data' => [
                'degree' => $degree,
                'institution' => $institution,
                'field_of_study' => $field_of_study,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'gpa' => $gpa,
                'description' => $description,
                'achievements' => $achievements
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add education entry']);
    }
    
    $insert_stmt->close();
    
} catch (Exception $e) {
    error_log("Error adding education: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Database error occurred: ' . $e->getMessage(),
        'debug' => [
            'degree' => $degree,
            'institution' => $institution,
            'field_of_study' => $field_of_study,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'gpa' => $gpa,
            'description' => $description,
            'achievements' => $achievements
        ]
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
