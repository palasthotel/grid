<?php

include 'classes/bootstrap.php';

$storage=new grid_db('localhost','enno','','grid');
if(isset($_REQUEST['path']) && $_REQUEST['path']=='/ajax') {
	$storage->handleAjaxCall();
	return;
}
?>
<html>
<meta http-equiv="Content-Type" content="text/html; Charset=UTF-8">
<link href="css/layout.css" rel="stylesheet" type="text/css" />
<head>
</head>
<body>
<div class="main">
<?php
$grid=$storage->loadGrid(42);
$output=$grid->render(false);
echo $output;
?>
</div>
</body>
</html>

