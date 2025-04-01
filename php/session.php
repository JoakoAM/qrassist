<?php
header('Content-Type: application/json');
require 'funciones.php';
session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode(['success' => true, 'message' => 'sesion activa']);    
} else {
    echo json_encode(['success' => false, 'message' => 'sesion inactiva']);
}



?>