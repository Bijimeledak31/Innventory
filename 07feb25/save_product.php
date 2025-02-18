<?php
// save_product.php
require_once 'config.php';

$database = new Database();
$db = $database->getConnection();

// Terima data dari request
$data = json_decode(file_get_contents("php://input"), true);

try {
    if (isset($data['id']) && !empty($data['id'])) {
        // Update existing product
        $query = "UPDATE Produk SET 
                    barcode = :barcode,
                    nama_produk = :nama_produk,
                    deskripsi = :deskripsi,
                    id_kategori = :id_kategori,
                    satuan = :satuan,
                    harga_beli = :harga_beli
                  WHERE id = :id";
    } else {
        // Insert new product
        $query = "INSERT INTO Produk 
                    (barcode, nama_produk, deskripsi, id_kategori, satuan, harga_beli) 
                  VALUES 
                    (:barcode, :nama_produk, :deskripsi, :id_kategori, :satuan, :harga_beli)";
    }

    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(":barcode", $data['barcode']);
    $stmt->bindParam(":nama_produk", $data['nama_produk']);
    $stmt->bindParam(":deskripsi", $data['deskripsi']);
    $stmt->bindParam(":id_kategori", $data['id_kategori']);
    $stmt->bindParam(":satuan", $data['satuan']);
    $stmt->bindParam(":harga_beli", $data['harga_beli']);
    
    if (isset($data['id']) && !empty($data['id'])) {
        $stmt->bindParam(":id", $data['id']);
    }

    if($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Product saved successfully"));
    } else {
        echo json_encode(array("success" => false, "message" => "Failed to save product"));
    }
} catch(PDOException $e) {
    echo json_encode(array("success" => false, "message" => "Error: " . $e->getMessage()));
}
?>