<?php
/**
 * Plugin Name: Grid
 * Description: Helps layoing out landing pages
 * Version: 0.0
 * Author: Palasthotel (in Person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 */
 
require('core/classes/bootstrap.php');
require('core/classes/wordpress/grid_sidebar_box.php');
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
	add_submenu_page(null,'The Grid','The Grid','edit_posts','grid','grid_wp_thegrid');
	add_submenu_page(null,'Grid AJAX','The Grid AJAX','edit_posts','grid_ajax','grid_wp_ajax');
	add_submenu_page(null,'Grid CKEditor Config','Grid CKEditor Config','edit_posts','grid_ckeditor_config','grid_wp_ckeditor_config');
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

function grid_wp_add_meta_boxes()
{
	$post_types=get_post_types(array(),'objects');
	foreach($post_types as $key=>$post_type)
	{
		if(get_option("grid_".$key."_enabled",FALSE))
		{
			add_meta_box("grid",__("Grid"),"grid_wp_meta_box");
		}
	}
}

add_action("add_meta_boxes","grid_wp_add_meta_boxes");

function grid_wp_meta_box($post)
{
	$url=add_query_arg(array('page'=>'grid','postid'=>$post->ID),admin_url('admin.php'));
?>
<a href="<?php echo $url?>">Switch to the Grid</a>
<?php
}

$grid_loaded=FALSE;

function grid_wp_get_storage()
{
	global $grid_loaded;
	if(!$grid_loaded)
	{
		do_action('grid_load_classes');
	}
	$user=wp_get_current_user();
	$storage=new grid_db(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,$user->user_login);
	$storage->templatesPath=get_template_directory().'/grid/';
/*
	$storage->ajaxEndpoint=new grid_drupal_ajaxendpoint();
	$storage->ajaxEndpoint->storage=$storage;
*/
	return $storage;

	
}

function grid_wp_thegrid()
{
	global $wpdb;
//	$storage=grid_wp_get_storage();
	$postid=$_GET['postid'];
	$rows=$wpdb->get_results("select grid_id from grid_nodes where nid=$postid");
	if(!empty($_POST))
	{
		$storage=grid_wp_get_storage();
		$id=$storage->createGrid();
		$wpdb->query("insert into grid_nodes (nid,grid_id) values ($postid,$id)");
		wp_redirect(add_query_arg(array('page'=>'grid','postid'=>$postid),admin_url('admin.php')));
	}
	if(count($rows)==0)
	{
?>
<form method="post" action="<?php echo add_query_arg(array('noheader'=>true,'page'=>'grid','postid'=>$postid),admin_url('admin.php'));?>">
<p>There is no grid. Boot one?</p>
<?php echo submit_button();?>
</form>
<?php		
	}
	else
	{
		$grid_id=$rows[0]->grid_id;
		$ckeditor_path='wp-content/plugins/grid/js/ckeditor/ckeditor.js';
		$jslang="js/language/grid-en.js";
		if(file_exists("js/language/grid-".WPLANG.".js"))
			$jslang="js/language/grid-".WPLANG.".js";
?>
<script>
document.ID=<?php echo $grid_id?>;
document.gridmode="grid";
document.PathToConfig="<?php echo add_query_arg(array("noheader"=>true,"page"=>"grid_ckeditor_config"),admin_url("admin.php"))?>";
document.gridajax="<?php echo add_query_arg(array('noheader'=>true,'page'=>'grid_ajax'),admin_url('admin.php'))?>";
document.previewpattern="<?php echo add_query_arg(array('grid_preview'=>true,'grid_revision'=>'{REV}'),get_permalink($postid));?>";
document.previewurl="<?php echo add_query_arg(array("grid_preview"=>true),get_permalink($potsid));?>";
//TODO: path to config is missing
</script>

<script src="<?php echo plugins_url();?>/grid/js/jquery-ui-1.10.2.custom.js">
</script>
<script src="<?php echo plugins_url();?>/grid/js/jquery.tmpl.min.js">
</script>
<script src="<?php echo plugins_url();?>/grid/<?php echo $jslang;?>">
</script>
<script src="<?php echo plugins_url();?>/grid/js/templates.js">
</script>
<script src="<?php echo plugins_url();?>/grid/js/jquery.iframe-transport.js">
</script>
<script src="<?php echo plugins_url();?>/grid/js/jquery.fileupload.js">
</script>

<script src="<?php echo plugins_url();?>/grid/js/grid2.0.js">
</script>
<link rel="stylesheet" type="text/css" href="<?php echo plugins_url();?>/grid/core/templates/main.css">
<?php
require "core/templates/editor.html.tpl.php";
	}
}

function grid_wp_ajax()
{
	$storage=grid_wp_get_storage();
	$storage->handleAjaxCall();
	die();
}

function grid_wp_get_grid_by_postid($postid)
{
	global $wpdb;
	$rows=$wpdb->get_results("select grid_id from grid_nodes where nid=$postid");
	if(count($rows)>0)
	{
		return $rows[0]->grid_id;
	}
	return FALSE;
}

function grid_wp_load($post)
{
	global $wpdb;
	$postid=$post->ID;
	if(get_option('grid_'.$post->post_type.'_enabled',FALSE))
	{
		$rows=$wpdb->get_results("select grid_id from grid_nodes where nid=$postid");
		if(count($rows)>0)
		{
			$grid_id=$rows[0]->grid_id;
			$storage=grid_wp_get_storage();
			$grid=NULL;
			if(isset($_GET['grid_preview']) && $_GET['grid_preview'])
			{
				if(isset($_GET['grid_revision']))
				{
					$revision=$_GET['grid_revision'];
					$grid=$storage->loadGridByRevision($grid_id,$revision);
				}
				else
				{
					$grid=$storage->loadGrid($grid_id);
				}
			}
			else
			{
				$grid=$storage->loadGrid($grid_id,FALSE);
			}
			$post->grid=$grid;
		}	
	}
}
add_action('the_post','grid_wp_load');

function grid_wp_render($content)
{
	$post=get_post();
	
	if(isset($post->grid))
	{
		wp_enqueue_style("grid_frontend",plugins_url()."/grid/core/templates/default-frontend.css");
		return $content.$post->grid->render(FALSE);
	}
}
add_filter('the_content','grid_wp_render');

function grid_wp_ckeditor_config()
{
	$styles=array();
	$formats=array();
	
	$styles=apply_filters("grid_styles",$styles);
	$styles=apply_filters("grid_formats",$formats);
	require("grid_htmlbox_ckeditor_config_js.tpl.php");
	die();
}