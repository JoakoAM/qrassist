<?php
header('Content-Type: application/json');
require 'funciones.php';
session_start();

$qrText = $_POST['qrText'] ?? '';

if (!empty($qrText) && !empty($_SESSION['user_id'])) {
    try {
        enlazarqr($qrText);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'QR code text or secret not provided']);
}

?>