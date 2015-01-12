<?php 
/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

header('Content-Type: text/css'); 
?>
.grid-slots-wrapper{
	display: table;
	box-sizing: border-box;
	width: 100%;
	max-width: 100%;
}
.grid-slot{
	box-sizing:border-box;
	display: table-cell;
	vertical-align: top;
}
<?php

// $container_types = db_query("SELECT * FROM {grid_container_type}");

foreach ($container_types as $key => $type) 
{
	$type_arr = explode("-",$type->type);
	$container_type = $type_arr[0];
	$dimensions = array_slice($type_arr, 1);
	$dimension = implode("-",$dimensions);

	if(!($container_type == "c" || $container_type == "s")) continue;

	$space_to_right = ($type->space_to_right)? $this->calculateSpace($type->space_to_right) : 0;
	$space_to_left = ($type->space_to_left)? $this->calculateSpace($type->space_to_left) : 0;
	$container_dimension = (100-($space_to_left+$space_to_right));
	
	if($container_type == "s") print ".grid-toolbar ";

	print ".grid-container-".$type->type;
	print ($space_to_left > 0)? ".grid-container-left-space-".$type->space_to_left: "";
	print ($space_to_right > 0)? ".grid-container-right-space-".$type->space_to_right: "";
	print "{"; 
		print ($space_to_left > 0)? "padding-left:".$space_to_left."%;" : "";
		print ($space_to_right > 0)? "padding-right:".$space_to_right."%;" : "";
		print "width:$container_dimension%;";
	print "}";


	$calculated = array();
	foreach ($dimensions as $key => $slot) 
	{
		if($slot == 0 || in_array($slot, $calculated)) continue;
		$calculated[] = $slot;
		print ".grid-container-".$type->type." .grid-slot-".$slot."{";
			print "width:".(($this->calculateSpace($slot)/$container_dimension)*100)."%";
		print "}";
	}
}

?>
// for frontend only
.grid-frontend .grid-content-container-wrapper.grid-container-c-2d3-0 .grid-container-*,
.grid-frontend .grid-content-container-wrapper.grid-container-c-0-2d3 .grid-container-*
{
	width: 100%;
	padding: 0px;
}
.grid-frontend .grid-content-container-wrapper.grid-container-c-2d3-0
{
	padding: 0px;
	float: left;
}
.grid-frontend .grid-content-container-wrapper.grid-container-c-0-2d3
{
	padding: 0px;
	float:right;
}
.grid-frontend .grid-slot-sidebar{
	display: block;
	width: 33.3%;
}
.grid-frontend .grid-slot-sidebar.grid-right-sidebar
{
	float: right;
}
.grid-frontend .grid-slot-sidebar.grid-left-sidebar
{
	float:left;
}