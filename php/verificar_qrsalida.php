<?php
header('Content-Type: application/json');
require 'funciones.php';

$qr = $_POST['qrText'] ?? '';

if (!empty($qr)){
    try {
        $response = qrsalida($qr);
        echo json_encode($response);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'QR vacio']);
    
}
?>
