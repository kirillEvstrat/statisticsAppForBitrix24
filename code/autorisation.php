<?php
session_start();
$password = $_POST['password'];
if($password==="6PHcHx"){
    echo json_encode("ok");
    $_SESSION['access']='ok';
}
else {
    echo json_encode('Неверный пароль!');
}