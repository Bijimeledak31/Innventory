<?php
// products.php
require_once 'config.php';

// Inisialisasi koneksi database
$database = new Database();
$db = $database->getConnection();

try {
    // Query untuk mengambil data produk beserta kategorinya
    $query = "SELECT 
                p.*, 
                k.nama_kategori,
                COALESCE(i.total_stok, 0) as total_stok
              FROM 
                Produk p
                LEFT JOIN Kategori k ON p.id_kategori = k.id
                LEFT JOIN (
                    SELECT id_produk, SUM(jumlah_stok) as total_stok 
                    FROM Inventori 
                    GROUP BY id_produk
                ) i ON p.id = i.id_produk
              ORDER BY p.id DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();
    
    // Set header content-type ke JSON
    header('Content-Type: application/json');
    
    // Ambil semua data sebagai array
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Kembalikan data dalam format JSON
    echo json_encode($products);

} catch(PDOException $e) {
    // Jika terjadi error, kembalikan pesan error
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>