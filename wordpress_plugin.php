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
require('core/classes/wordpress/grid_post_box.php');
require('core/classes/wordpress/grid_media_box.php');
require('core/classes/wordpress/grid_posts_box.php');
require('grid.install');

class grid_wordpress_ajaxendpoint extends grid_ajaxendpoint
{
	public function loadGrid($gridid)
	{
		global $wpdb;
		$return=parent::loadGrid($gridid);
		$rows=$wpdb->get_results("select nid from grid_nodes where grid_id=$gridid");
		$post=get_post($rows[0]->nid);
		$type=$post->post_type;
		if($type==get_option('grid_sidebar_post_type'))
		{
			$return['isSidebar']=TRUE;
		}
		else
		{
			$return['isSidebar']=FALSE;
		}
		return $return;
	}
}

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
		update_option("grid_default_container","C-3-3-3-3");
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
	add_submenu_page('tools.php','Reusable grid boxes','Reusable grid boxes','edit_posts','grid_reuse_boxes','grid_wp_reuse_boxes');
	add_submenu_page(null,'edit reuse box','edit reuse box','edit_posts','grid_edit_reuse_box','grid_wp_edit_reuse_box');
	add_submenu_page(null,'delete reuse box','delete reuse box','edit_posts','grid_delete_reuse_box','grid_wp_delete_reuse_box');
	add_submenu_page('tools.php','reusable grid container','Reusable grid container','edit_posts','grid_reuse_containers','grid_wp_reuse_containers');
	add_submenu_page(null,'edit reuse container','edit reuse container','edit_posts','grid_edit_reuse_container','grid_wp_edit_reuse_container');
	add_submenu_page(null,'delete reuse container','delete reuse container','edit_posts','grid_delete_reuse_container','grid_wp_delete_reuse_container');
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
	
	add_settings_section("grid_default_container","New Grids","grid_wp_default_container_section","grid_settings");
	add_settings_field("grid_default_container","Which container should be placed automatically","grid_wp_default_container_html","grid_settings","grid_default_container");
	register_setting("grid_settings","grid_default_container");
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

function grid_wp_default_container_section()
{
	echo "";
}

function grid_wp_default_container_html()
{
	$storage=grid_wp_get_storage();
	$containers=$storage->fetchContainerTypes();
?>
<select id="grid_default_container" name="grid_default_container">
<option value="__NONE__">Empty</option>
<?php
	foreach($containers as $container)
	{
		$type=$container['type'];
		if(strpos($type, "C-")===0)
		{
?>
<option value="<?php echo $type?>" <?php echo (get_option('grid_default_container')==$type ? 'selected' : '')?> ><?php echo $type?></option>
<?php
		}
	}
?>
</select>
<?php
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
		$grid_loaded=TRUE;
	}
	global $grid_storage;
	if(!isset($grid_storage))
	{
		$user=wp_get_current_user();
		$storage=new grid_db(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,$user->user_login);
		$storage->ajaxEndpoint=new grid_wordpress_ajaxendpoint();
		$storage->ajaxEndpoint->storage=$storage;
		$storage->templatesPath=get_template_directory().'/grid/';
		$grid_storage=$storage;	
		
	}
	return $grid_storage;

	
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
		$grid=$storage->loadGrid($id);
		$post=get_post($postid);
		if($post->post_type==get_option('grid_sidebar_post_type'))
		{
			$grid->insertContainer("SC-4",0);		
		}
		else if(get_option('grid_default_container','__NONE__')!='__NONE__')
		{
			$grid->insertContainer(get_option('grid_default_container'),0);
		}
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
		wp_enqueue_media();
//		wp_enqueue_script('media-upload');
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
document.previewurl="<?php echo add_query_arg(array("grid_preview"=>true),get_permalink($postid));?>";
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

function grid_wp_reuse_boxes()
{
	$storage=grid_wp_get_storage();

	$usedIds=$storage->getReusedBoxIds();
	$boxids=$storage->getReuseableBoxIds();
	$boxes=array();
	foreach($boxids as $boxid)
	{
		$boxes[]=$storage->loadReuseBox($boxid);
	}
	$grid=new grid_grid();
	$grid->storage=$storage;
	$grid->container=array();
	foreach($boxes as $box)
	{
		$container=new grid_container();
		$container->storage=$storage;
		$container->type="C-12";
		$container->stype="container";
		$container->readmore=t("edit");
		$container->readmoreurl=add_query_arg(array('page'=>'grid_edit_reuse_box','boxid'=>$box->boxid),admin_url('admin.php'));
		if(!in_array($box->boxid, $usedIds))
		{
			$container->epilog="<a href='".add_query_arg(array('page'=>'grid_delete_reuse_box','boxid'=>$box->boxid),admin_url('admin.php'))."'>delete</a>";
		}
		
		$container->slots=array();
		$container->slots[]=new grid_slot();
		$container->slots[0]->storage=$storage;
		$container->slots[0]->boxes=array();
		$container->slots[0]->boxes[]=$box;
		$grid->container[]=$container;
	}
?>
<link rel=stylesheet href="<?php echo plugins_url();?>/grid/core/templates/main.css">
<?php
	echo $grid->render(TRUE);
}

function grid_wp_edit_reuse_box()
{
	$boxid=$_GET['boxid'];

	wp_enqueue_media();
	$grid_id=$rows[0]->grid_id;
	$ckeditor_path='wp-content/plugins/grid/js/ckeditor/ckeditor.js';
	$jslang="js/language/grid-en.js";
	if(file_exists("js/language/grid-".WPLANG.".js"))
		$jslang="js/language/grid-".WPLANG.".js";
?>
<script>
document.ID="box:<?php echo $boxid?>";
document.gridmode="box";
document.PathToConfig="<?php echo add_query_arg(array("noheader"=>true,"page"=>"grid_ckeditor_config"),admin_url("admin.php"))?>";
document.gridajax="<?php echo add_query_arg(array('noheader'=>true,'page'=>'grid_ajax'),admin_url('admin.php'))?>";
document.previewurl="";
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

function grid_wp_delete_reuse_box()
{
	$boxid=$_GET['boxid'];
	if(isset($_POST) && !empty($_POST))
	{
		$storage=grid_wp_get_storage();
		$storage->deleteReusableBox($boxid);
		wp_redirect(add_query_arg(array("page"=>"grid_reuse_boxes"),admin_url("tools.php")));
	}
	else
	{
?>
<form method="post" action="<?php echo add_query_arg(array("noheader"=>true,"page"=>"grid_delete_reuse_box","boxid"=>$boxid),admin_url('admin.php'))?>">
<p>Delete this box?</p>
<?php echo submit_button();?>
</form>
<?php
	}
}

function grid_wp_reuse_containers()
{
	$storage=grid_wp_get_storage();
	$containerIds=$storage->getReuseContainerIds();
	$usedIds=$storage->getReusedContainerIds();
	
	$grid=new grid_grid();
	$grid->storage=$storage;
	$grid->container=array();
	foreach($containerIds as $id)
	{
		$container=$storage->loadReuseContainer($id);
		$container->grid=$grid;
		$grid->container[]=$container;
		
		$edit=new grid_container();
		$edit->grid=$grid;
		$edit->storage=$storage;
		$edit->type="C-12";
		$edit->readmore="edit";
		$edit->slots=array();
		$edit->prolog=$container->reusetitle;
		$edit->readmoreurl=add_query_arg(array('page'=>'grid_edit_reuse_container','containerid'=>$id),admin_url('admin.php'));
		if(!in_array($id, $usedIds))
		{
			$edit->epilog='<a href="'.add_query_arg(array('page'=>'grid_delete_reuse_container','containerid'=>$id),admin_url('admin.php')).'">delete</a>';
		}
		$grid->container[]=$edit;
	}
	
?>
<link rel=stylesheet href="<?php echo plugins_url();?>/grid/core/templates/main.css">
<?php
	echo $grid->render(TRUE);
}

function grid_wp_edit_reuse_container()
{
	$containerid=$_GET['containerid'];

	wp_enqueue_media();
	$grid_id=$rows[0]->grid_id;
	$ckeditor_path='wp-content/plugins/grid/js/ckeditor/ckeditor.js';
	$jslang="js/language/grid-en.js";
	if(file_exists("js/language/grid-".WPLANG.".js"))
		$jslang="js/language/grid-".WPLANG.".js";
?>
<script>
document.ID="container:<?php echo $containerid?>";
document.gridmode="container";
document.PathToConfig="<?php echo add_query_arg(array("noheader"=>true,"page"=>"grid_ckeditor_config"),admin_url("admin.php"))?>";
document.gridajax="<?php echo add_query_arg(array('noheader'=>true,'page'=>'grid_ajax'),admin_url('admin.php'))?>";
document.previewurl="";
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

function grid_wp_delete_reuse_container()
{
	$containerid=$_GET['containerid'];
	if(isset($_POST) && !empty($_POST))
	{
		$storage=grid_wp_get_storage();
		$storage->deleteReusableContainer($containerid);
		wp_redirect(add_query_arg(array('page'=>'grid_reuse_containers'),admin_url('tools.php')));
	}
	else
	{
?>
<form method="post" action="<?php echo add_query_arg(array('noheader'=>true,'page'=>'grid_delete_reuse_container','containerid'=>$containerid),admin_url('admin.php'));?>">
<p>Delete this container?</p>
<?php echo submit_button();?>
<?php
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
		return $content.$post->grid->render(FALSE);
	}
	else
	{
		return $content;
	}
}
add_filter('the_content','grid_wp_render');

function grid_wp_head()
{
	//echo '<link rel="stylesheet" href="'.plugins_url()."/grid/core/templates/default-frontend.css".'" media="all">';
	if(file_exists(get_template_directory()."/grid/default-frontend.css"))
	{
		wp_enqueue_style("grid_frontend",get_template_directory_uri()."/grid/default-frontend.css");
	}
	else
	{
		wp_enqueue_style("grid_frontend",plugins_url()."/grid/core/templates/default-frontend.css");
	}
}
add_action("wp_enqueue_scripts","grid_wp_head");
//add_filter("wp_head", "grid_wp_head");
function grid_wp_ckeditor_config()
{
	$styles=array();
	$formats=array();
	
	$styles=apply_filters("grid_styles",$styles);
	$styles=apply_filters("grid_formats",$formats);
	require("grid_htmlbox_ckeditor_config_js.tpl.php");
	die();
}