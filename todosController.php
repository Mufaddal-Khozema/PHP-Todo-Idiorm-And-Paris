<?php

require_once 'todos.php';
class TodoController
{
    private static function checkID(int $id): void
    {
        if (!isset($id) || empty($id)) {
            throw new Exception('ID is not set or empty');
        }
    }

    private static function checkTask($task): void
    {
        if ($task instanceof Model) {
        } else {
            var_dump($task);
            throw new Exception('Todo is not a class of Model');
        }
    }

    private static function checkText(&$text): void
    {
        if(empty($text)){
            throw new Exception('Empty Input');
        }
        if ($text != preg_replace('/[^a-z0-9\s]/i', '', $text)) {
            throw new Exception('Text Contains Special Characters Or More than one space character');
        }
    }

    public static function create(string &$text)
    {
        
        try {
            self::checkText($text);

            $task = Model::factory('Todos')->create();
            self::checkTask($task);
            $task->populate($text);
            $task->save();

            echo $text;

        } catch (Exception $e) {
            header('Content-Type: application/json');
            return json_encode(array("error" => $e->getMessage()));
        }
    }

    public static function updateColor(&$id)
    {
        try {
            self::checkID($id);

            $todo = Model::factory('Todos')->find_one($id);
            self::checkTask($todo);
            $nextColor = $todo->changeColor();
            $todo->save();
            return json_encode(array("success" => true, "next_color" => $nextColor));

        } catch (Exception $e) {
            return json_encode(array("error" => $e->getMessage()));
        }
    }

    public static function toggleDone(&$id)
    {
        try {
            self::checkID($id);

            $todo = Model::factory('Todos')->find_one($id);
            self::checkTask($todo);
            $done = $todo->toggle_done($id);
            $todo->save();
            return json_encode(array("success" => true, "is_checked" => $done));

        } catch (Exception $e) {
            return json_encode(array("error" => $e->getMessage()));
        }
    }

    public static function updatePositions(string &$id_arr)
    {
        try {
            $id_arr = json_decode($id_arr);
            foreach ($id_arr as $i => $id) {
                self::checkID($id);
                $todo = Model::factory('Todos')->find_one($id);
                self::checkTask($todo);
                $todo->change_position($i + 1);
                $todo->save();
                return json_encode(array("success" => true));
            }

        } catch (Exception $e) {
            return json_encode(array("error" => $e->getMessage()));
        }
    }

    public static function updateText(int &$id, string &$text)
    {
        try {
            self::checkID($id);
            self::checkText($text);

            $todo = Model::factory('Todos')->find_one($id);
            self::checkTask($todo);

            $todo->change_text($text);
            $todo->save();
            return json_encode(array("success" => true, "text" => $text));

        } catch (Exception $e) {
            return json_encode(array("error" => $e->getMessage()));
        }
    }

    public static function remove(int &$id)
    {
        try {
            self::checkID($id);
            Model::factory('Todos')->find_one($id)->delete();
            return json_encode(array("success" => true));

        } catch (Exception $e) {
            return json_encode(array("error" => $e->getMessage()));
        }       
    }
}