<?php
require 'db_conn.php';
require_once 'todosController.php';
$request_type = $_POST['request_type'];

if (isset($request_type)) {
    switch ($request_type) {
        case 'create': 
            echo TodoController::create($_POST['text']);
            break;
        case 'update_done':
            echo TodoController::toggleDone($_POST['id']);
            break;
        case 'update_color':
            echo TodoController::updateColor($_POST['id']);
            break;
        case 'update_positions':
            echo TodoController::updatePositions($_POST['new_order']);
            break;
        case 'update_text':
            echo TodoController::updateText($_POST['id'], $_POST['text']);
            break;
        case 'remove':
            echo TodoController::remove($_POST['id']);
            break;
        default:
            echo 'Hello';
    }
}