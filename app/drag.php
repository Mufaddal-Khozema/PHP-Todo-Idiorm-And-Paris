<?php
    if(isset($_POST['values']) && $_POST['values'] != 0){
        require '../db_conn.php';
        require '../todos.php';
        $len = $_POST['values'];
        $order = [];
        for($i = 0; $i < $len; $i++){
            array_push($order, $_POST[(string)($i)]);
        }

        if(empty($order)){
            echo 'error';
        } else {
            foreach ($order as $i => $position) {
                $todo = Model::factory('Todos')->find_one($order[$i]);
                if($todo){
                    $todo->change_position($i+1);
                    $todo->save(); 
                }else {
                    echo "Couldn't get Todo/Task";
                }
            }
            exit();
        }
    }else {
        echo 'Values is 0 or not set';   
    }
?>