<?php

require 'funciones.php';


$sql = 'SELECT lugar, estado FROM estacionamientos';
$stmt = $conn->prepare($sql);
$stmt->execute();
$stmt->bind_result($lugar, $estado);

echo "<table id='tablalugares'class='container_lugares'>";
echo "<thead><tr>";
echo "<tr><th colspan='2'>ESTACIONAMIENTO</th></tr>";
echo "<th>Lugar</th>";
echo "<th>Estado</th>";
echo "</tr></thead>";
echo "<tbody id='lugares-container'>";
while ($stmt->fetch()) {
    echo "<tr>
    <td>" . $lugar . "</td>";
    if ($estado == 'ocupado'){
        echo "<td class='ocupado'>OCUPADO</td>";
    }else if ($estado == 'libre'){
        echo "<td class='libre'>LIBRE</td>";
    }
    "</tr>";
}
echo "</tbody>";
echo "</table>";






?>