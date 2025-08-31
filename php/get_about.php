<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Fetch personal info
    $personalInfoSql = "SELECT * FROM personal_info LIMIT 1";
    $personalInfoResult = $conn->query($personalInfoSql);
    $personalInfo = $personalInfoResult ? $personalInfoResult->fetch_assoc() : null;

    // Fetch about stats (using your actual table name 'about_stats')
    $statsSql = "SELECT * FROM about_stats ORDER BY display_order";
    $statsResult = $conn->query($statsSql);
    $stats = [];
    if ($statsResult) {
        while ($row = $statsResult->fetch_assoc()) {
            // Map the database columns to the expected format
            $stats[] = [
                'id' => $row['id'],
                'value' => $row['number'], // Map 'number' to 'value'
                'label' => $row['label'],
                'description' => $row['description'],
                'icon' => $row['icon'],
                'display_order' => $row['display_order']
            ];
        }
    }

    // Fetch about sections (using your actual table name 'about_sections')
    $sectionsSql = "SELECT * FROM about_sections ORDER BY display_order";
    $sectionsResult = $conn->query($sectionsSql);
    $sections = [];
    if ($sectionsResult) {
        while ($row = $sectionsResult->fetch_assoc()) {
            $sections[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'content' => $row['content'],
                'icon' => $row['icon'],
                'display_order' => $row['display_order']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'personal_info' => $personalInfo,
            'stats' => $stats,
            'sections' => $sections
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
