<?php 
header('Content-Type: application/json');
require 'funciones.php';
session_start();

if ($_SESSION['user_permiso'] == 'lector') {
    echo json_encode(['success' => true, 'message' => 'acceso permitido']);    
} else if ($_SESSION['user_permiso'] == 'usuario') {
    echo json_encode(['success' => false, 'message' => 'acceso denegado']);
}



?>