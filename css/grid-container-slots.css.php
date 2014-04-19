<?php 
header('Content-Type: text/css'); 

$result = db_query("SELECT * FROM {grid_container_type}");
foreach ($result as $key => $type) {
	$type_arr = explode("-",$type->type);
	$container_type = $container_type = $type_arr[0];
	$dimensions = array_slice($type_arr, 1);
	$dimension = implode("-",$dimensions);

	if(!($container_type == "c")) continue;

	$space_to_right = ($type->space_to_right)? $this->calculateSpace($type->space_to_right) : 0;
	$space_to_left = ($type->space_to_left)? $this->calculateSpace($type->space_to_left) : 0;
	$container_dimension = (100-($space_to_left+$space_to_right));

	?>
	.grid-container-<?php echo $type->type;
					echo ($space_to_left > 0)? ".grid-container-left-space-".$type->space_to_left: "";
					echo ($space_to_right > 0)? ".grid-container-right-space-".$type->space_to_right: ""; ?>{
		<?php 
		print ($space_to_left > 0)? "padding-left:".$space_to_left."%;" : "";
		print ($space_to_right > 0)? "padding-right:".$space_to_right."%;" : "";
		print "width:$container_dimension%;";
		?>
	}
	<?php
	foreach ($dimensions as $key => $slot) {
		if($slot == 0) continue;
		?>
		.grid-container-<?php echo $type->type; ?> .grid-slot-<?php echo $slot; ?>{
			<?php
			print "width:".(($this->calculateSpace($slot)/$container_dimension)*100)."%";
			?>
		}
		<?php
	}
}

?>