<?php
require_once('paris.php');
class Todos extends Model 
{
    private $validColors = ['colorRed', 'colorGreen', 'colorBlue', 'colorYellow'];

    public function populate(string $text)
    {
        $maxPosition = Model::factory('Todos')->max('position');

        $this->text = $text;
        $this->color = 'colorRed';
        $this->position = (int) $maxPosition + 1;
    }

    public function toggle_done(int $id): bool  
    {
        $taskDone = $this->is_checked;
        $done = $taskDone ? 0 : 1;

        $this->is_checked = $done;
        return $done ? true : false;
    }

    public function change_color(): string
    {
        $validColors = $this->validColors;
        $todoColor = $this->color;
    
        $idx = array_search($todoColor, $validColors);
        
        // Pick the next color in validColor
        $nextColor = isset($validColors[$idx+1]) ? $validColors[$idx+1] : $validColors[0];
        
        $this->color = $nextColor;
        return $nextColor;
    }

    public function change_position(int $newPosition): void 
    {
        $this->position = $newPosition;
    }

    public function change_text(string $newText): void 
    {
        $this->text = $newText;
    }
}