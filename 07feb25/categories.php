<?php
// categories.php
require_once 'config.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT id, nama_kategori FROM Kategori ORDER BY nama_kategori";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode($categories);
} catch(PDOException $e) {
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>