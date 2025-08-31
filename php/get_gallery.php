<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Fetch photos from photo_gallery table
    $sql = "SELECT * FROM photo_gallery ORDER BY display_order, id DESC";
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $photos = [];
    while ($row = $result->fetch_assoc()) {
        $photos[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'image_url' => $row['image_url'],
            'category' => $row['category'],
            'display_order' => $row['display_order']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $photos
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
