<?php
session_start();
require 'conexion.php';
function regis( $a, $b, $c, $d, $e, $f, $g, $h, $i){
    $a = htmlspecialchars($a, ENT_QUOTES, 'UTF-8');
    $b = htmlspecialchars($b, ENT_QUOTES, 'UTF-8');
    $c = htmlspecialchars($c, ENT_QUOTES, 'UTF-8');
    $d = htmlspecialchars($d, ENT_QUOTES, 'UTF-8');
    $e = htmlspecialchars($e, ENT_QUOTES, 'UTF-8');
    $f = htmlspecialchars($f, ENT_QUOTES, 'UTF-8');
    $g = htmlspecialchars($g, ENT_QUOTES, 'UTF-8');
    $h = htmlspecialchars($h, ENT_QUOTES, 'UTF-8');
    $i = htmlspecialchars($i, ENT_QUOTES, 'UTF-8');


    $a = base64_decode($a);
    $b = base64_decode($b);
    $c = base64_decode($c);
    $d = base64_decode($d);
    $e = base64_decode($e);
    $f = base64_decode($f);
    $g = base64_decode($g);
    $h = base64_decode($h);
    $i = base64_decode($i);


    require 'conexion.php';
    $sql_check = 'SELECT rut FROM usuarios WHERE rut = ?';
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param('s', $a);
    $stmt_check->execute();
    $stmt_check->bind_result($count);
    $stmt_check->fetch();
    $stmt_check->close();
    if ($count > 0) {
        // Usuario ya existe
        echo json_encode(['success' => false, 'message' => 'Usuario existe']);
        exit();
    }
    $iv = openssl_random_pseudo_bytes(16); // IV debe ser de 16 bytes para AES-256-CBC
    $encrypted_nombre = openssl_encrypt($b, 'aes-256-cbc', $e, 0, $iv);
    $encrypted_correo = openssl_encrypt($d, 'aes-256-cbc', $e, 0, $iv);
    $encrypted_numeroc = openssl_encrypt($c, 'aes-256-cbc', $e, 0, $iv);
    $encrypted_patente = openssl_encrypt($g, 'aes-256-cbc', $e, 0, $iv);
    $encrypted_marca = openssl_encrypt($h, 'aes-256-cbc', $e, 0, $iv);
    $encrypted_modelo = openssl_encrypt($i, 'aes-256-cbc', $e, 0, $iv);
    $iv_base64 = base64_encode($iv);

    $create = date('Y-m-d H:i:s');

    $hashed_password = password_hash($f, PASSWORD_BCRYPT);
    $hashed_secret = password_hash($e, PASSWORD_BCRYPT);
    $b64_hashed_password = base64_encode($hashed_password);
    $b64_hashed_secret = base64_encode($hashed_secret);


    $sql = 'INSERT INTO usuarios (rut, nombre, secret, correo, contrasena, iv, numeroc, patente, marca, modelo, fecha_creacion) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssssss', $a, $encrypted_nombre, $b64_hashed_secret, $encrypted_correo, $b64_hashed_password, $iv_base64, $encrypted_numeroc, $encrypted_patente, $encrypted_marca, $encrypted_modelo, $create);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    echo json_encode(['success' => true, 'message' => 'Usuario registrado']);
    exit();
}

function validarusuario($a,$b){
    session_start();
    require 'conexion.php';
    $a = htmlspecialchars($a, ENT_QUOTES, 'UTF-8');
    $b = htmlspecialchars($b, ENT_QUOTES, 'UTF-8');
    $sql = 'SELECT id, secret, contrasena, estado, permiso FROM usuarios WHERE rut = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $a);
    $stmt->execute();
    $stmt->bind_result($id, $b64_hashed_secret, $b64_hashed_password, $estado, $permiso);
    $stmt->fetch();
    $stmt->close();
    $conn->close();
    $c = $b64_hashed_secret;
    $hashed_password = base64_decode($b64_hashed_password);
    if (password_verify($b, $hashed_password)) {
        if ($permiso == 'lector') {
            $_SESSION['user_id'] = $id;
            $_SESSION['user_permiso'] = $permiso;
            return (['success' => true, 'message' => 'lector valido']);
        } else if ($permiso == 'usuario') {
            $_SESSION['user_id'] = $id;
            $_SESSION['db_secret'] = $c;
            $_SESSION['user_permiso'] = $permiso;
            $_SESSION['estado'] = $estado;
            return (['success' => false, 'message' => 'Usuario valido']);
        }
    } else {
        return (['success' => false, 'message' => 'Usuario no validado']);
    }
}

function preguntarestado($a){
    session_start();
    require 'conexion.php';
    $a = $_SESSION['user_id'];
    $sql = 'SELECT estado FROM usuarios WHERE id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $a);
    $stmt->execute();
    $stmt->bind_result($estado);
    $stmt->fetch();
    $stmt->close();
    $conn->close();
    return $estado;
};


    function enlazarqr($qrText) {
        session_start();
        global $conn;   
        $qrText = htmlspecialchars($qrText, ENT_QUOTES, 'UTF-8');
        $secret = $_SESSION['user_id'];
        $horac = date('Y-m-d H:i:s');
        try {
            // Preparar y ejecutar la consulta SQL para insertar el texto del QR y el identificador del usuario en la base de datos
            $sql = 'INSERT INTO qr_creados (id_usuario, content, fecha_creacion) VALUES (?, ?, ?)';
            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                throw new Exception('Error preparing statement: ' . $conn->error);
            }
            $stmt->bind_param('sss', $secret,$qrText, $horac);
            if (!$stmt->execute()) {
                throw new Exception('Error executing statement: ' . $stmt->error);
            }
            $stmt->close();
            $conn->close();
            echo json_encode(['success' => true, 'message' => 'QR generado']);
        } catch (Exception $e) {
            throw $e;
        }
    }

    function secret($c) {
        try {
            require 'conexion.php';
            $a = $_SESSION['db_secret'];
            $b = $_SESSION['user_id'];
            $c = htmlspecialchars($c, ENT_QUOTES, 'UTF-8');
            // Decodificar los datos
            $a = base64_decode($a);
            $c = base64_decode($c);
            // Depuración
            $a = ($a);
            if ($c === false) {
                throw new Exception('Error al decodificar base64');
            }
            // Verificar si el secret es correcto
            if (password_verify($c, $a)) {
                $a = base64_encode($a);
                datousr($a,$b, $c);
                echo json_encode(['success' => true, 'message' => 'palabra correcta']);
            } else {
                echo json_encode(['success' => false, 'message' => 'palabra incorrecta']);
            }
            // Verificar si el secret es correcto
        } catch (Exception $e) {
            return (['success' => false, 'message' => $e->getMessage()]);
        }
    }

function datousr($encrypted_secret,$id_usuario, $secret){
    require 'conexion.php';
    $sql = 'SELECT id, nombre, correo, iv, numeroc, patente, marca, modelo FROM usuarios WHERE secret   = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $encrypted_secret);
    $stmt->execute();
    $stmt->bind_result($id_usuario, $encryptednombre, $encryptedcorreo, $iv_base64, $encryptednumeroc, $encryptedpatente, $encryptedmarca, $encryptedmodelo);
    $stmt->fetch();
    $stmt->close();
    $conn->close();
    $iv = base64_decode($iv_base64);
    $nombre = openssl_decrypt($encryptednombre, 'aes-256-cbc', $secret, 0, $iv);
    $correo = openssl_decrypt($encryptedcorreo, 'aes-256-cbc', $secret, 0, $iv);
    $numeroc = openssl_decrypt($encryptednumeroc, 'aes-256-cbc', $secret, 0, $iv);
    $patente = openssl_decrypt($encryptedpatente, 'aes-256-cbc', $secret, 0, $iv);
    $marca = openssl_decrypt($encryptedmarca, 'aes-256-cbc', $secret, 0, $iv);
    $modelo = openssl_decrypt($encryptedmodelo, 'aes-256-cbc', $secret, 0, $iv);

    datostemp($id_usuario, $nombre, $correo, $numeroc, $patente, $marca, $modelo);
}

function datostemp($id, $nombre, $correo, $numeroc, $patente, $marca, $modelo){
    require 'conexion.php';
    $sql = 'INSERT INTO datostemp (id_usuario, nombre, correo, numeroc, patente, marca, modelo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssss', $id, $nombre, $correo, $numeroc, $patente, $marca, $modelo);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}
function verificarQR($qr){
    session_start();
    global $conn;
    $qr = htmlspecialchars($qr, ENT_QUOTES, 'UTF-8');
    try{   
        $sql = 'SELECT COUNT(*) FROM qr_creados WHERE content = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $qr);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        if ($count == 0) {
            echo json_encode(['success' => true, 'message' => 'QR no existe invalido', 'qr' => $qr]);
        } elseif ($count > 0) {
            $sql = 'SELECT id_usuario, estado FROM qr_creados WHERE content = ?';
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $qr);
            $stmt->execute();
            $stmt->bind_result($id_usuario, $estado);
            $stmt->fetch();
            $stmt->close();
            if ($estado == 'inactivo'){
                eliminarqr($qr);
                throw new Exception("QR inactivo", 1);
                echo json_encode(['success' => true, 'message' => 'QR generado']);
            } else if ($estado == 'activo'){
                $ocupado = 'ocupado';
                $libre = 'libre';
                $sql = 'SELECT COUNT(*) FROM estacionamientos WHERE usuario_id = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $id_usuario);
                $stmt->execute();
                $stmt->bind_result($count);
                $stmt->fetch();
                $stmt->close();
                if ($count == 0){
                $sql = 'UPDATE estacionamientos SET estado = ?, usuario_id = ? WHERE estado = ? LIMIT 1';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('sss', $ocupado, $id_usuario, $libre);
                $stmt->execute();
                $stmt->close();
                $sql = 'SELECT nombre, correo, numeroc, patente, marca, modelo FROM datostemp WHERE id_usuario = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $id_usuario);
                $stmt->execute();
                $stmt->bind_result($nombre, $correo, $celular, $patente, $marca, $modelo);
                $stmt->fetch();
                $stmt->close(); 
                $hora_entrada = date('H:i');
                $sql = 'SELECT lugar FROM estacionamientos WHERE usuario_id = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $id_usuario);
                $stmt->execute();
                $stmt->bind_result($lugar);
                $stmt->fetch();
                $stmt->close();
                $fecha = date('Y-m-d');
                $hora_entrada = date('H:i');
                $sql = 'INSERT INTO registro (nombre, celular, patente, marca, modelo, qr_code, fecha, hora_entrada , lugar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('sssssssss', $nombre, $celular, $patente, $marca, $modelo, $qr, $fecha, $hora_entrada, $lugar);
                $stmt->execute();
                $stmt->close();
                if (empty($nombre) || empty($correo) || empty($celular) || empty($patente)) {
                    throw new Exception("Datos temporales incompletos para el usuario");
                }
                $sql = 'DELETE FROM datostemp WHERE id_usuario = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $id_usuario);
                $stmt->execute();
                $stmt->close();
                cambiarestadoqr($qr);
                cambiarestadousrentr($id_usuario);
                echo json_encode(['success' => true, 'message' => 'QR valido']);
            } else {
                $sql = 'SELECT lugar FROM estacionamientos WHERE usuario_id = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $id_usuario);
                $stmt->execute();
                $stmt->bind_result($lugar);
                $stmt->fetch();
                $stmt->close();
                $sql = 'SELECT nombre, correo, numeroc, patente, marca, modelo FROM datostemp WHERE id_usuario = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $id_usuario);
                $stmt->execute();
                $stmt->bind_result($nombre, $correo, $celular, $patente, $marca, $modelo);
                $stmt->fetch();
                $stmt->close(); 
                $fecha = date('d-m-Y');
                $hora_entrada = date('H:i');
                $sql = 'INSERT INTO registro (nombre, celular, patente, marca, modelo, qr_code, fecha, hora_entrada , lugar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('sssssssss', $nombre, $celular, $patente, $marca, $modelo, $qr, $fecha, $hora_entrada, $lugar);
                $stmt->execute();
                $stmt->close();
                if (empty($nombre) || empty($correo) || empty($celular) || empty($patente)) {
                    throw new Exception("Datos temporales incompletos para el usuario");
                }
                $sql = 'DELETE FROM datostemp WHERE id_usuario = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $id_usuario);
                $stmt->execute();
                $stmt->close();
                cambiarestadoqr($qr);
                cambiarestadousrentr($id_usuario);
                echo json_encode(['success' => true, 'message' => 'QR valido']);
            }
            }
        }
    } catch (Exception $e) {
        throw $e;
    }
}
function cambiarestadousrentr($id_usuario){
    global $conn;
    $sql = 'UPDATE usuarios SET estado = "dentro" WHERE id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $id_usuario);
    $stmt->execute();
    $stmt->close();
}
function cambiarestadousrsali($id_usuario){
    global $conn;
    $sql = 'UPDATE usuarios SET estado = "fuera" WHERE id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $id_usuario);
    $stmt->execute();
    $stmt->close();
}
function cambiarestadoqr($qr){
    session_start();
    global $conn;
    $sql = 'UPDATE qr_creados SET estado_escaneo = "escaneado" WHERE content = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $qr);
    $stmt->execute();
    $stmt->close();
}
function verificarestadoqr($id_usuario){
    session_start();
    global $conn;
    $sql = 'SELECT estado_escaneo FROM qr_creados WHERE id_usuario = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $id_usuario);
    $stmt->execute();
    $stmt->bind_result($estado_escaneo);
    $stmt->fetch();
    $stmt->close();
    return $estado_escaneo;
}
function estadousr($id){
    global $conn;
    $sql = 'SELECT estado FROM usuarios WHERE id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $stmt->bind_result($estado);
    $stmt->fetch();
    $stmt->close();
    return $estado;
}
function estacionamiento($id){
    global $conn;
    $sql = 'SELECT lugar FROM estacionamientos WHERE usuario_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $stmt->bind_result($lugar);
    $stmt->fetch();
    $stmt->close();
    return $lugar;
}

function verificarQRExistente() {
    session_start();
    require 'conexion.php';
    global $conn;
    $secret = $_SESSION['user_id'];
    $sql = 'SELECT content FROM qr_creados WHERE id_usuario = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Error preparing statement: ' . $conn->error);
    }
    $stmt->bind_param('s', $secret);
    $stmt->execute();
    $stmt->bind_result($qr_code);
    $stmt->fetch();
    $stmt->close();
    if (!empty($qr_code)) {
        $sql = 'SELECT estado FROM qr_creados WHERE content = ?';
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            throw new Exception('Error preparing statement: ' . $conn->error);
        }
        $stmt->bind_param('s',$qr_code);
        $stmt->execute();
        $stmt->bind_result($estado);
        $stmt->fetch();
        $stmt->close();
        
        if ($estado == 'inactivo') {
            eliminarqr($qr_code);
            return (['success' => false, 'message' => 'QR generado']);
        } else if ($estado == 'activo'){
            $sql = 'UPDATE qr_creados SET estado_escaneo = "escaneando" WHERE content = ?';
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $qr_code);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            return (['success' => true, 'message' => 'QR existente', 'qrText' => $qr_code]);
        }
        } else {
            return (['success' => true, 'message' => 'QR no existe']);
        }
}
function qrsalida($qr) {
    global $conn;
    $qr = htmlspecialchars($qr, ENT_QUOTES, 'UTF-8');
    
    try {
        // Verificar si el QR existe
        $sql = 'SELECT COUNT(*) FROM qr_creados WHERE content = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $qr);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        if ($count == 0) {
            return ['success' => false, 'message' => 'QR invalido'];
        } elseif ($count > 0) {
            // Obtener id_usuario, fecha_creacion y estado del QR
            $sql = 'SELECT id_usuario, fecha_creacion, estado FROM qr_creados WHERE content = ?';
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $qr);
            $stmt->execute();
            $stmt->bind_result($id_usuario, $fecha_creacion, $estado);
            $stmt->fetch();
            $stmt->close();
            if ($estado == 'inactivo') {
                eliminarqr($qr); // Llamar a eliminarqr antes de lanzar la excepción
                throw new Exception("QR inactivo", 1);
            } elseif ($estado == 'activo') {
                $libre = 'libre';
                // Actualiza el estado del estacionamiento
                $sql = 'UPDATE estacionamientos SET estado = ?, usuario_id = NULL WHERE usuario_id = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('ss', $libre, $id_usuario);
                $stmt->execute();
                $stmt->close();
                $hora_salida = date('H:i');
                $sql = 'UPDATE registro SET hora_salida = ? WHERE qr_code = ?';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('ss', $hora_salida, $qr);
                $stmt->execute();
                $stmt->close();
                // Actualiza el estado del QR
                $fechaven = date('Y-m-d H:i:s');
                $sql = 'UPDATE qr_creados SET estado = "inactivo", fecha_expiracion = ? WHERE content = ? AND NOW() >= DATE_ADD(fecha_creacion, INTERVAL 3 DAY)';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('ss', $fechaven, $qr);
                $stmt->execute();
                $stmt->close();
                // Actualiza el estado del usuario
                cambiarestadousrsali($id_usuario);
                cambiarestadoqr($qr);
                return ['success' => true, 'message' => 'QR valido', 'estado' => $estado ]; ;
            }
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage() , 'qr' => $qr];
    }
}

function eliminarqr($qr){
    require 'conexion.php';
                $sql = 'SELECT id_usuario, content, fecha_creacion, fecha_expiracion FROM qr_creados WHERE content = ?';
                $stmt = $conn->prepare($sql);
                if ($stmt === false) {
                    throw new Exception('Error preparing statement: ' . $conn->error);
                }
                $stmt->bind_param('s' , $qr);
                $stmt->execute();
                $stmt->bind_result($id_usuario, $qr, $fecha_creacion, $fecha_expiracion);
                $stmt->fetch();
                $stmt->close();
                $sql_insert = 'INSERT INTO qr_inactivos (id_usuario, content, fecha_creacion, fecha_vencimiento) VALUES (?, ?, ?, ?)';
                $stmt_insert = $conn->prepare($sql_insert);
                if ($stmt_insert === false) {
                    throw new Exception('Error preparing statement: ' . $conn->error);
                }
                $stmt_insert->bind_param('ssss', $id_usuario, $qr, $fecha_creacion, $fecha_expiracion);
                $stmt_insert->execute();
                $stmt_insert->close();
                // Luego, eliminar de la tabla qr_creados
                $sql_delete = 'DELETE FROM qr_creados WHERE content = ?';
                $stmt_delete = $conn->prepare($sql_delete);
                if ($stmt_delete === false) {
                    throw new Exception('Error preparing statement: ' . $conn->error);
                }
                $stmt_delete->bind_param('s', $qr);
                $stmt_delete->execute();
                $stmt_delete->close();
}

?>
