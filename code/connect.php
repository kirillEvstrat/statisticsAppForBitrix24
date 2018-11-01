<?php
//phpinfo();

$host = 'localhost';
$db   = 'sitemanager';
$user = 'bitrix0';
$pass = 'TDNKqiTA-lVAzzISLLz+';
$charset = 'utf8';

$mysqli = new mysqli('localhost', $user, $pass, $db);
if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}


