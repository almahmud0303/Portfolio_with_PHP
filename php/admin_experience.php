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
if (!isset($input['position']) || !isset($input['company_name']) || !isset($input['start_date']) || !isset($input['description'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize and validate input
$position = trim($input['position']);
$company_name = trim($input['company_name']);
$location = isset($input['location']) ? trim($input['location']) : '';
$start_date = $input['start_date'];
$end_date = isset($input['end_date']) && !empty($input['end_date']) ? $input['end_date'] : null;
$current_job = isset($input['current_job']) ? (bool)$input['current_job'] : false;
$description = trim($input['description']);
$achievements = isset($input['achievements']) ? trim($input['achievements']) : '';
$technologies_used = isset($input['technologies_used']) ? trim($input['technologies_used']) : '';

// Validate dates
if (!strtotime($start_date)) {
    echo json_encode(['success' => false, 'message' => 'Invalid start date']);
    exit;
}

if ($end_date && !strtotime($end_date)) {
    echo json_encode(['success' => false, 'message' => 'Invalid end date']);
    exit;
}

// If current job is true, end_date should be null
if ($current_job) {
    $end_date = null;
}

// Validate that if not current job, end_date is required
if (!$current_job && !$end_date) {
    echo json_encode(['success' => false, 'message' => 'End date is required for past positions']);
    exit;
}

try {
    // Include database connection
    require_once 'db_connect.php';
    
    // Check if experience entry already exists
    $check_stmt = $conn->prepare("SELECT id FROM experience WHERE position = ? AND company_name = ? AND start_date = ?");
    $check_stmt->bind_param("sss", $position, $company_name, $start_date);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Experience entry already exists']);
        exit;
    }
    
    // Insert new experience entry
    $insert_stmt = $conn->prepare("
        INSERT INTO experience (position, company_name, location, start_date, end_date, current_job, description, achievements, technologies_used) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insert_stmt->bind_param("sssssiss", $position, $company_name, $location, $start_date, $end_date, $current_job, $description, $achievements, $technologies_used);
    
    if ($insert_stmt->execute()) {
        $experience_id = $conn->insert_id;
        
        echo json_encode([
            'success' => true, 
            'message' => 'Experience entry added successfully!',
            'experience_id' => $experience_id,
            'data' => [
                'position' => $position,
                'company_name' => $company_name,
                'location' => $location,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'current_job' => $current_job,
                'description' => $description,
                'achievements' => $achievements,
                'technologies_used' => $technologies_used
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add experience entry']);
    }
    
    $insert_stmt->close();
    
} catch (Exception $e) {
    error_log("Error adding experience: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
