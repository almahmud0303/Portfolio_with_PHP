<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Fetch experience data ordered by end date (most recent first)
    $sql = "SELECT 
                id,
                company_name,
                position,
                start_date,
                end_date,
                current_job,
                location,
                description,
                achievements,
                technologies_used,
                company_logo_url
            FROM experience 
            ORDER BY 
                CASE WHEN current_job = 1 THEN 0 ELSE 1 END,
                end_date DESC, 
                start_date DESC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $experience = [];
    
    while ($row = $result->fetch_assoc()) {
        // Format dates
        $startDate = $row['start_date'] ? date('M Y', strtotime($row['start_date'])) : '';
        $endDate = $row['end_date'] ? date('M Y', strtotime($row['end_date'])) : '';
        
        // Calculate duration
        $duration = '';
        if ($startDate && $endDate) {
            $start = new DateTime($row['start_date']);
            $end = new DateTime($row['end_date']);
            $interval = $start->diff($end);
            
            if ($interval->y > 0) {
                $duration = $interval->y . ' year' . ($interval->y > 1 ? 's' : '');
                if ($interval->m > 0) {
                    $duration .= ' ' . $interval->m . ' month' . ($interval->m > 1 ? 's' : '');
                }
            } elseif ($interval->m > 0) {
                $duration = $interval->m . ' month' . ($interval->m > 1 ? 's' : '');
            } else {
                $duration = $interval->d . ' day' . ($interval->d > 1 ? 's' : '');
            }
        }
        
        $experience[] = [
            'id' => $row['id'],
            'company_name' => $row['company_name'],
            'position' => $row['position'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'current_job' => (bool)$row['current_job'],
            'duration' => $duration,
            'location' => $row['location'],
            'description' => $row['description'],
            'achievements' => $row['achievements'],
            'technologies_used' => $row['technologies_used'] ? explode(',', $row['technologies_used']) : [],
            'company_logo_url' => $row['company_logo_url']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $experience
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
