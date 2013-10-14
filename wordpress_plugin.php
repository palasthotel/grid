<?php
/**
 * Plugin Name: Grid
 * Description: Helps layoing out landing pages
 * Version: 0.0
 * Author: Palasthotel (in Person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 */
 
require('core/classes/bootstrap.php');
require('grid.install');

function t($str){return $str;}

function db_query($querystring)
{
	$querystring=str_replace("{", "", $querystring);
	$querystring=str_replace("}", "", $querystring);
	global $grid_connection;
	$grid_connection->query($querystring) or die($grid_connection->error);
}


function grid_wp_activate()
{
	global $grid_connection;
	$options=get_option("grid",array());
	if(!isset($options['installed']))
	{
		$schema=grid_schema();
		$grid_connection=new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
		foreach($schema as $tablename=>$data)
		{
			$query="create table $tablename (";
			$first=TRUE;
			foreach($data['fields'] as $fieldname=>$fielddata)
			{
				if(!$first)
					$query.=",";
				else
					$first=FALSE;
				$query.="$fieldname ";
				if($fielddata['type']=='int')
				{
					$query.="int ";
				}
				else if($fielddata['type']=='text')
				{
					$query.="text ";
				}
				else if($fielddata['type']=='serial')
				{
					$query.="int ";
				}
				else if($fielddata['type']=='varchar')
				{
					$query.="varchar(".$fielddata['length'].") ";
				}
				else
				{
					die("unknown type ".$fielddata['type']);
				}
				if(isset($fielddata['unsigned']) && $fielddata['unsigned'])
				{
					$query.=" unsigned";
				}
				if(isset($fielddata['not null']) && $fielddata['not null'])
				{
					$query.=" not null";
				}
				if($fielddata['type']=='serial')
				{
					$query.=" auto_increment";
				}
			}
			$query.=",constraint primary key (".implode(",", $data['primary key']).")";
			$query.=") ";
			$query.="ENGINE = ".$data['mysql_engine'];
			$grid_connection->query($query) or die($grid_connection->error." ".$query);
		}
		grid_install();
		$arr=get_defined_functions();
		foreach($arr['user'] as $func)
		{
			if(preg_match("/^grid_update_\d\d\d\d$/", $func))
			{
				$options['installedupdates'][]=$func;
			}
		}
		$grid_connection->close();
		$options['installed']=TRUE;
		update_option("grid",$options);
	}
}
add_action("activate_grid/wordpress_plugin.php","grid_wp_activate");

function grid_wp_deactivate()
{

}
add_action("deactivate_grid/wordpress_plugin.php","grid_wp_deactivate");