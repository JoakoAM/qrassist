<?php
require 'funciones.php';

$aasd = base64_decode($_POST['aasd']);
$ddd = base64_decode($_POST['ddd']);

if (!empty($aasd) && !empty($ddd)) {
    try {
        $response = validarusuario($aasd, $ddd);
        echo json_encode($response);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Rut o contraseña vacios']);
}
?>