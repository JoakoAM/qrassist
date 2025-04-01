<?php
// Configuración de la base de datos
$servername = 'sql309.infinityfree.com'; // Cambia esto si tu servidor de base de datos no está en localhost
$username = 'if0_37398975'; // Tu nombre de usuario de la base de datos
$password = '7mgEUnHbPRfdDO4'; // Tu contraseña de la base de datos
$dbname = 'if0_37398975_encrypt'; // El nombre de tu base de datos

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

?>