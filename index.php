<?php
require 'db_conn.php';
require 'todos.php';
$todos = Model::factory('Todos')->order_by_asc('position')->find_many();
?>
<!DOCTYPE html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=us-ascii" />
  <link rel="stylesheet" href="style.css" type="text/css" />
  <title></title>
</head>

<body>
  <div id="page-wrap">
    
    <div id="header">
      <h1><a href="">PHP Sample Test App</a></h1>
    </div>

    <div id="main">
      <noscript>This site just doesn't work, period, without JavaScript</noscript>
      <ul id="list" class="ui-sortable">

        <?php foreach ($todos as $task) { ?>
        <li data-color="<?php echo $task->color?>" class="<?php echo $task->color?> item" rel="1" id="<?php echo $task->id?>">

          <div id="<?php echo $task->position?>" class="draggertab tab" draggable="true"></div>

          <div id="<?php echo $task->id?>" class="colortab tab"></div>

          <span id="<?php echo $task->id?>" class="<?php if($task->is_checked === "1") echo "crossout" ?> tab" title="Double-click to edit..." >
            
            <?php echo $task->text?>

          </span>

          <div id="<?php echo $task->id?>" class="donetab tab"></div>
          
          <div id="<?php echo $task->id?>" class="deletetab tab"></div>

        </li>
        <?php }?>
      </ul> 
	  <br />
          <div class="form">
            <form id="add-new" method="" autocomplete="off">
              <?php if(isset($_GET['mess']) && $_GET['mess'] === "error") {?>
                <input type="text" id="new-list-item-text" style="border-color:#ff6666" name="text" placeholder="This field is required"/>
              <?php } else {?>
              <input type="text" id="new-list-item-text" name="text" placeholder="What do you want to do"/>
              <?php }?>
              <input type="submit" id="add-new-submit" value="Add" class="button" />
            </form>

          </div>

      <div class="clear"></div>
    </div>
  </div>
</body>
<script src="script.js" type="module"></script>
</html>
