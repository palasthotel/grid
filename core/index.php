<?php

include 'classes/bootstrap.php';

$storage=new grid_db("localhost","root","entwickler","grid");
if(isset($_REQUEST['path']) && $_REQUEST['path']=='/ajax')
{
	$storage->handleAjaxCall();
	return;
}
?>
<html>
<meta http-equiv="Content-Type" content="text/html; Charset=UTF-8">
<head>
</head>
<body>
<?php
$grid=$storage->loadGrid(42);
$output=$grid->render(false);
echo $output;
?>
</body>
</html>

