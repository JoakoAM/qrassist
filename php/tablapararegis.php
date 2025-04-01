<?php
require 'conexion.php';

$fecha_actual = date('Y-m-d');

// Consulta SQL para obtener los registros del día
$sql = "SELECT * FROM registros_entrada WHERE DATE(hora_entrada) = '$fecha_actual'";
$result = $conn->query($sql);

$registros = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }
}

$conn->close();

// Devolver los registros en formato JSON
header('Content-Type: application/json');
echo json_encode($registros);
?>