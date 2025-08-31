<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Fetch education data ordered by completion date (most recent first)
    $sql = "SELECT 
                id,
                degree,
                institution,
                field_of_study,
                start_date,
                end_date,
                gpa,
                description,
                achievements,
                certificate_url,
                image_url
            FROM education 
            ORDER BY end_date DESC, start_date DESC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $education = [];
    
    while ($row = $result->fetch_assoc()) {
        // Format dates
        $startDate = $row['start_date'] ? date('M Y', strtotime($row['start_date'])) : '';
        $endDate = $row['end_date'] ? date('M Y', strtotime($row['end_date'])) : '';
        
        $education[] = [
            'id' => $row['id'],
            'degree' => $row['degree'],
            'institution' => $row['institution'],
            'field_of_study' => $row['field_of_study'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'duration' => $startDate && $endDate ? "$startDate - $endDate" : '',
            'gpa' => $row['gpa'],
            'description' => $row['description'],
            'achievements' => $row['achievements'],
            'certificate_url' => $row['certificate_url'],
            'image_url' => $row['image_url']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $education
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>
