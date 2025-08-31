<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Fetch skills with category information
    $sql = "SELECT 
                s.id,
                s.name,
                s.proficiency_level,
                s.description,
                s.category_id,
                s.display_order,
                c.name as category_name,
                c.description as category_description
            FROM skills s
            JOIN skill_categories c ON s.category_id = c.id
            ORDER BY c.display_order, s.display_order";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $skills = [];
    
    while ($row = $result->fetch_assoc()) {
        $skills[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'proficiency_level' => $row['proficiency_level'],
            'description' => $row['description'],
            'category_id' => $row['category_id'],
            'display_order' => $row['display_order'],
            'category_name' => $row['category_name'],
            'category_description' => $row['category_description']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $skills
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
