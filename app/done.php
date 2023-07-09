<?php
    if(isset($_POST['id'])){
        require '../db_conn.php';
        require_once '../todos.php';
        $id = $_POST['id'];

        if(empty($id)){
            echo 'error';
        } else {
            $todo = Model::factory('Todos')->find_one($id);
            if($todo){
                $done = $todo->toggle_done($id);
                $todo->save();
                echo $done;
            }
            exit();
        }
    } else {
        echo 'error';
    }

?>