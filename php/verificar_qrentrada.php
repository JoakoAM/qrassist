<?php
header('Content-Type: application/json');
require 'funciones.php';

$qr = $_POST['qrText'] ?? '';

if (!empty($qr)) {
    try {
        verificarQR($qr);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'QR vacio']);
    
}


?>