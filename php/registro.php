<?php
// Conexión a la base de datos
require 'conexion.php';

// Definir los títulos de las columnas
$columnas = [
    "Nombre" => "fas fa-user",               // Icono de usuario
    "Celular" => "fas fa-mobile-alt",        // Icono de celular
];

$columnas2 =[
    "Lugar estacionamiento" => "fa fa-map-marker-alt", // Icono de estacionamiento
    "Entradareg" => "fas fa-sign-in-alt",       // Icono de entrada
    "Salidareg" => "fas fa-sign-out-alt"        // Icono de salida
];

$iconos = [
    "Nombre" => "fas fa-user", 
    "Celular" => "fas fa-mobile-alt",  
];

$iconos2 =[
    "Lugar estacionamiento" => "fa fa-map-marker-alt", // Icono de estacionamiento
    "Entradareg" => "fas fa-sign-in-alt",       // Icono de entrada
    "Salidareg" => "fas fa-sign-out-alt"        // Icono de salida
];
// Consulta para obtener los registros
$day = date("Y-m-d");
$sql = "SELECT nombre, celular, patente, marca, modelo, hora_entrada, hora_salida, lugar FROM registro WHERE fecha = '$day'";
$conn->query($sql);
$result = $conn->query($sql);

// Iniciar la tabla:
echo "<table id='tablaregis'class='rounded-table'>";
// Generar los encabezados de la tabla
echo "<thead><tr>";
echo "<tr><th colspan=8''>REGISTRO DIA: " . $day ."</th></tr>";
foreach ($columnas as $columna => $icono) {
    echo "<th class='" . strtolower(str_replace(' ', '', $columna)) . "'><i class='$icono'></i></th>";
}
    echo "<th colspan='3' class='patente'><i class='fas fa-car'></i></th>";
foreach ($columnas2 as $columna => $icono) {
    echo "<th class='" . strtolower(str_replace(' ', '', $columna)) . "'><i class='$icono' ></i></th>";
}
echo "</tr></thead>";

// Generar el cuerpo de la tabla
echo "<tbody id='registro-container'>";
if ($result->num_rows > 0) {
    // Si hay resultados, recorrerlos y generar una fila por cada uno
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
        <td>" . $row["nombre"] . "</td>
        <td>" . $row["celular"] . "</td>
        <td>" . $row["patente"] . "</td>
        <td>" . $row["marca"] . "</td>
        <td>" . $row["modelo"] . "</td>
        <td>" . $row["lugar"] . "</td>
        <td>" . $row["hora_entrada"] . "</td>
        <td>" . $row["hora_salida"] . "</td>
        </tr>";
    }
} else {
    // Si no hay registros, mostrar un mensaje indicando que no hay datos
    echo "<tr><td colspan='8'>No hay registros</td></tr>";
}
echo "</tbody>";

// Cerrar la tabla
echo "</table>";

// Cerrar la conexión
$conn->close();
?>
