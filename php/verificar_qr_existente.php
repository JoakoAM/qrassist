<?php
header('Content-Type: application/json');
require 'funciones.php';
session_start();

if (!empty($_SESSION['user_id'])) {
        $response = verificarQRExistente();
        echo json_encode($response);
    } else {
    echo json_encode(['success' => false, 'message' => 'sesion no iniciada']);
}

?>