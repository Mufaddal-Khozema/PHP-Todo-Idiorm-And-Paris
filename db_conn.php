<?php


$includePaths = [
    'C:\wamp64\db',
    get_include_path(),   // Retrieve the existing include path
];

// Set the updated include path
set_include_path(implode(PATH_SEPARATOR, $includePaths));


require_once('db.php');
require_once("idiorm.php");
require_once("paris.php");

ORM::configure("mysql:host=$hostname;dbname=$db_name");
ORM::configure('username', $username);
ORM::configure('password', $password);
$db = ORM::get_db();
?>