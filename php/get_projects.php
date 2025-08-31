<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Get filter parameters
    $category = isset($_GET['category']) ? $_GET['category'] : 'all';
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6; // Default to 6 for work page
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Build the SQL query with filters
    $whereConditions = [];
    $params = [];
    $types = '';
    
    if ($category && $category !== 'all') {
        $whereConditions[] = "p.category = ?";
        $params[] = $category;
        $types .= 's';
    }
    
    if ($search) {
        $whereConditions[] = "(p.title LIKE ? OR p.description LIKE ? OR p.technologies LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= 'sss';
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Count total matching projects
    $countSql = "SELECT COUNT(*) as total FROM projects p $whereClause";
    if (!empty($params)) {
        $countStmt = $conn->prepare($countSql);
        $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $totalResult = $countStmt->get_result();
        $total = $totalResult->fetch_assoc()['total'];
        $countStmt->close();
    } else {
        $totalResult = $conn->query($countSql);
        $total = $totalResult->fetch_assoc()['total'];
    }
    
    // Fetch projects with pagination
    $sql = "SELECT 
                p.id,
                p.title,
                p.description,
                p.category,
                p.image_url,
                p.live_url,
                p.source_code_url,
                p.technologies,
                p.created_date,
                p.featured
            FROM projects p 
            $whereClause
            ORDER BY p.featured DESC, p.created_date DESC
            LIMIT ? OFFSET ?";
    
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $projects = [];
    
    while ($row = $result->fetch_assoc()) {
        // Convert technologies string to array
        $technologies = $row['technologies'] ? explode(',', $row['technologies']) : [];
        
        $projects[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'category' => $row['category'],
            'image_url' => $row['image_url'],
            'live_url' => $row['live_url'],
            'source_code_url' => $row['source_code_url'],
            'technologies' => $technologies,
            'created_date' => $row['created_date'],
            'featured' => (bool)$row['featured']
        ];
    }
    
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'data' => $projects,
        'pagination' => [
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $total
        ]
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
