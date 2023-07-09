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
                $nextColor = $todo->changeColor();
                $todo->save();
                echo $nextColor;
            }
            exit();
        }
    }else {
        echo 'error';
    }
?>