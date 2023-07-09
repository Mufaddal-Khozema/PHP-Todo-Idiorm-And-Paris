<?php
    if(isset($_POST['id'])){
        require '../db_conn.php';
        require '../todos.php';
        $id = $_POST['id'];

        if(empty($id)){
            echo 0;
        } else {
            Model::factory('Todos')->find_one($id)->delete();
            echo 1;
            exit();
        }
    }else {
        echo "No ID for deletion";
    }
?>