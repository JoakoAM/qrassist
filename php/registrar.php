<?php
require 'funciones.php';
$a = $_POST['wdqdqdwqdwqdwqd']; // rut
$b = $_POST['awdsakdjawjkdh']; // nombre
$c = $_POST['scsadahkdwanshw']; // numeroc
$d = $_POST['awdmsadawjdawdsad']; // correo
$e = $_POST['adalkwjdajdlwjidasmc']; // secret
$f = $_POST['awodjaskldjoawidjaklsd']; // contraseña
$g = $_POST['awdiaskldaslkdaji']; // secret input
$h = $_POST['ddddwwasdwwd']; // marca
$i = $_POST['dawdsawdsa']; // modelo
if (!empty($a) && !empty($b) && !empty($c) && !empty($d) && !empty($e) && !empty($f) && !empty($g) && !empty($h) && !empty($i)) {
    try {
        regis($a, $b, $c, $d, $e, $f , $g, $h, $i);
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    error_log("Datos incompletos");
    echo json_encode(['success' => false, 'message' => 'Datos incompletos' . $e]);
}


?>