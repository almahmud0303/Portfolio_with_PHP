<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Fetch skill categories
    $sql = "SELECT 
                id,
                name,
                description,
                display_order,
                created_at
            FROM skill_categories
            ORDER BY display_order";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $categories = [];
    
    while ($row = $result->fetch_assoc()) {
        $categories[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'display_order' => $row['display_order'],
            'created_at' => $row['created_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $categories
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
