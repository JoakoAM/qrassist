<?php

session_start();
require 'conexion.php';
$sql = "SELECT lugar FROM estacionamientos WHERE usuario_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $_SESSION['user_id']);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($lugar);
echo "<table class='tabla-estacionamiento'>";  // Agregar la clase 'rounded-table' para bordes redondeados

if ($stmt->num_rows > 0) {
    echo "<thead><tr><th>LUGAR ASIGNADO</th></tr></thead>";
    echo "<tbody>";
    while ($stmt->fetch()) {
        // Mostrar el lugar con el icono de parking
        echo "<tr><td>" . $lugar . "</td></tr>";
    }
    echo "</tbody>";
} else {
    echo "<tbody><tr><td colspan='1'>No hay lugar asignado</td></tr></tbody>";
}

echo "</table>";

$stmt->close();
$conn->close();




?>