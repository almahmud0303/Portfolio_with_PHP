<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // Fetch personal info
    $personalInfoSql = "SELECT * FROM personal_info LIMIT 1";
    $personalInfoResult = $conn->query($personalInfoSql);
    $personalInfo = $personalInfoResult ? $personalInfoResult->fetch_assoc() : null;

    if ($personalInfo) {
        echo json_encode([
            'success' => true,
            'data' => $personalInfo
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'No personal information found'
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>
