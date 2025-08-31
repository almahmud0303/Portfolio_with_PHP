<?php
// Simple database connection test
header('Content-Type: text/plain');

echo "=== DATABASE CONNECTION TEST ===\n\n";

try {
    // Test MySQLi connection
    echo "Testing MySQLi connection...\n";
    $mysqli = new mysqli('localhost', 'root', '', 'portfolio_db');
    
    if ($mysqli->connect_error) {
        echo "MySQLi connection failed: " . $mysqli->connect_error . "\n";
    } else {
        echo "MySQLi connection successful!\n";
        echo "Server info: " . $mysqli->server_info . "\n";
        echo "Host info: " . $mysqli->host_info . "\n";
        
        // Test if database exists
        $result = $mysqli->query("SHOW DATABASES LIKE 'portfolio_db'");
        if ($result->num_rows > 0) {
            echo "Database 'portfolio_db' exists!\n";
            
            // Test if tables exist
            $tables = ['personal_info', 'about_stats', 'about_sections'];
            foreach ($tables as $table) {
                $result = $mysqli->query("SHOW TABLES LIKE '$table'");
                if ($result->num_rows > 0) {
                    echo "Table '$table' exists!\n";
                    
                    // Count rows in table
                    $count_result = $mysqli->query("SELECT COUNT(*) as count FROM $table");
                    $count = $count_result->fetch_assoc()['count'];
                    echo "Table '$table' has $count rows\n";
                } else {
                    echo "Table '$table' does NOT exist!\n";
                }
            }
        } else {
            echo "Database 'portfolio_db' does NOT exist!\n";
        }
        
        $mysqli->close();
    }
    
} catch (Exception $e) {
    echo "MySQLi error: " . $e->getMessage() . "\n";
}

echo "\n=== END TEST ===\n";
?>
