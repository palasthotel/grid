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
		update_option("grid_landing_page_enabled",true);
		update_option("grid_sidebar_enabled",true);
		update_option("grid_sidebar_post_type","sidebar");
	}
	else
	{
		//TODO: implement update support
	}
}
add_action("activate_grid/wordpress_plugin.php","grid_wp_activate");

function grid_wp_init()
{
	$args=array(
		'public'=>true,
		'label'=>'Landing Pages',
		'labels'=>array(
			'singular_name'=>'Landing Page',
		),
	);
	register_post_type('landing_page',$args);
	
	$args=array(
		'public'=>true,
		'label'=>'Sidebars',
		'labels'=>array(
			'singular_name'=>'Sidebar',
		),
	);
	register_post_type('sidebar',$args);
}
add_action("init","grid_wp_init");

function grid_wp_admin_menu()
{
	add_submenu_page('options-general.php','Grid','Grid','manage_options','grid_settings','grid_wp_settings');
}
add_action("admin_menu","grid_wp_admin_menu");

function grid_wp_settings()
{
?>
<div class="wrap">
<?php screen_icon(); ?>
<h2>Grid Settings</h2>
<form method="post" action="options.php">
<?php
settings_fields("grid_settings");
do_settings_sections("grid_settings");
?>
<?php submit_button(); ?>
</form>
</div>
<?php
}

function grid_wp_admin_init()
{
	add_settings_section("grid_post_types","Post Types","grid_wp_post_type_settings_section","grid_settings");
	$post_types=get_post_types(array(),'objects');
	foreach($post_types as $key=>$post_type)
	{
		add_settings_field("grid_".$key."_enabled",$post_type->labels->name,"grid_wp_post_type_html","grid_settings","grid_post_types",array('type'=>$key));
		register_setting("grid_settings","grid_".$key."_enabled");
	}
	
	add_settings_field("grid_sidebar_post_type","Which post type to use as sidebar content","grid_wp_sidebar_html","grid_settings","grid_post_types");
	register_setting("grid_settings","grid_sidebar_post_type");
}
add_action("admin_init","grid_wp_admin_init");

function grid_wp_post_type_html($args)
{
	$posttype=$args['type'];
	$value=get_option("grid_".$posttype."_enabled",FALSE);
?>
<input type="checkbox" id="grid_<?php echo $posttype?>_enabled" name="grid_<?php echo $posttype?>_enabled" type=checkbox <?php echo ($value?"checked":"")?>> Enabled
<?php
}

function grid_wp_post_type_settings_section()
{
	echo "Which post types should have grid support?";
}

function grid_wp_sidebar_html()
{
	$post_types=get_post_types(array(),'objects');
	$setting=get_option("grid_sidebar_post_type","__NONE__");
?>
<select id="grid_sidebar_post_type" name="grid_sidebar_post_type">
<option value="__NONE__" <?php echo ($setting=="__NONE__"?"selected":"")?>>Disable sidebar support</option>
<?php
	foreach($post_types as $key=>$post_type)
	{
?>
<option value="<?php echo $key?>" <?php echo ($key==$setting?"selected":"")?>><?php echo $post_type->labels->name?></option>
<?php
	}
?>
</select>
<?
}