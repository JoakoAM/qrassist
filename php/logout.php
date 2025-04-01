<?php
header('Content-Type: application/json');
require 'funciones.php';
session_start();
session_destroy();

echo json_encode(['success' => true, 'message' => 'sesion cerrada']);

?>