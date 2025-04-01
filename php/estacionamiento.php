    <?php 
session_start();
require 'funciones.php';
$a = $_SESSION['user_id'] ?? '';
$b = verificarestadoqr($a);

if ($b == 'escaneando'){
    echo json_encode(['success' => true, 'message' => 'escaneando qr']);
}else if ($b == 'escaneado'){
    $c = estadousr($a);
    if ($c == 'dentro'){
        echo json_encode(['success' => true, 'message' => 'salida marcada']);
    }else if ($c == 'fuera'){
        echo json_encode(['success' => true, 'message' => 'entrada marcada']);
    }
}

?>