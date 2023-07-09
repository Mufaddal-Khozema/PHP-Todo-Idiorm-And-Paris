<?php
if (isset($_POST['text'])) {
    require_once '../db_conn.php';
    require_once '../todos.php';
    $text = $_POST['text'];

    if (empty($text)) {
        header("Location: ../index.php?mess=error");
    } else {
        $task = Model::factory('Todos')->create();
        $task->populate($text);

        $task->save();
        if ($status) {
            header("Location: ../index.php?mess=success");
        } else {
            header("Location: ../index.php");
        }
        exit();
    }
} else {
    header("Location: ../index.php?mess=error");
}
?>