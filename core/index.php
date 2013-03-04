<html>
<head>
</head>
<body>
<?php

include 'classes/bootstrap.php';

$storage=new griddb();
$grid=$storage->loadGrid(1);
$output=$grid->render(false);
echo $output;
?>
</body>
</html>

