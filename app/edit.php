<?php
    if(isset($_POST['id']) && isset($_POST['text'])){
        require '../db_conn.php';
        require '../todos.php';
        $id = $_POST['id'];
        $text = $_POST['text'];

        if(empty($text)){
            echo false;
        } else {
            $todo = Model::factory('Todos')->find_one($id);
            if($todo){
                $todo->change_text($text);
                $res = $todo->save();
                echo 1;
            }
        }
        exit();
    }else {
        echo 'ID or Text is not set';
    }
?>