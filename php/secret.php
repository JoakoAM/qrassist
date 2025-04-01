<?php

require 'funciones.php';

$c = $_POST['dadwawdawdwadawd']; // secret input

if (!empty($c)) {
    try {
        secret($c);
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    error_log("Datos incompletos");
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}



?>