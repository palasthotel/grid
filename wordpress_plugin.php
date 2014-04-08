<?php
/**
 * Plugin Name: Grid
 * Description: Helps layoing out landing pages
 * Version: 0.0
 * Author: Palasthotel (in Person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 */

require('lib/grid.php');
global $grid_lib;
$grid_lib=new grid_library(); 
require('core/classes/wordpress/grid_sidebar_box.php');
require('core/classes/wordpress/grid_post_box.php');
require('core/classes/wordpress/grid_media_box.php');
require('core/classes/wordpress/grid_posts_box.php');


class grid_wordpress_ajaxendpoint extends grid_ajaxendpoint
{
	public function loadGrid($gridid)
	{
		global $wpdb;
		$return=parent::loadGrid($gridid);
		$rows=$wpdb->get_results("select nid from ".$wpdb->prefix."grid_nodes where grid_id=$gridid");
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
	global $wpdb;
	$querystring = str_replace("{", $wpdb->prefix, $querystring);
	$querystring = str_replace("}", "", $querystring);
	global $grid_connection;
	$result=$grid_connection->query($querystring) or die($querystring." failed: ".$grid_connection->error);
	if(is_object($result))
	{
		$return=array();
		while($row=$result->fetch_object())
		{
			$return[]=$row;
		}
		return $return;
	}
	return $result;
}


function grid_wp_activate()
{
	static $secondCall=FALSE;
	global $wpdb;
	global $grid_connection;
	global $grid_lib;
	$options=get_option("grid",array());
	if(!isset($options['installed']))
	{
		//TODO CONTINUE HERE!
		$schema=$grid_lib->getDatabaseSchema();
		$schema['grid_nodes']=array(
			'description'=>t('references nodes'),
			'fields'=>array(
				'nid'=>array(
					'description'=>t('node id'),
					'type' => 'int',
					'unsigned'=>true,
					'not null'=>true,
				),
				'grid_id'=>array(
					'description'=>t('grid id'),
					'type'=>'int',
					'size'=>'normal',
					'unsigned'=>true,
					'not null'=>true,
				),
			),
			'primary key'=>array('nid'),
			'mysql_engine'=>'InnoDB',
		);
		$grid_connection= grid_wp_get_mysqli();
		foreach($schema as $tablename=>$data)
		{
			$query="create table ".$wpdb->prefix."$tablename (";
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
			if(isset($data['primary key']))
				$query.=",constraint primary key (".implode(",", $data['primary key']).")";			
			$query.=") ";
			if(isset($data['mysql_engine']))
				$query.="ENGINE = ".$data['mysql_engine'];
			$grid_connection->query($query) or die($grid_connection->error." ".$query);
		}
		$grid_lib->install();
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
		$grid_lib->update();
	}
}
register_activation_hook(__FILE__,"grid_wp_activate");

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
	
	add_submenu_page('tools.php','grid styles','Grid Styles','edit_posts','grid_styles','grid_wp_styles');
}
add_action("admin_menu","grid_wp_admin_menu");

function grid_wp_styles()
{
	global $grid_connection;
	$grid_connection=grid_wp_get_mysqli();
	$storage=grid_wp_get_storage();
	global $grid_lib;
	$editor=$grid_lib->getStyleEditor();
	$html=$editor->run($storage);
	echo $html;
	$grid_connection->close();
}


function grid_wp_admin_bar()
{
	global $wp_admin_bar;
	global $post;
	if(isset($post->grid))
	{
		$wp_admin_bar->add_node(array(
			'id'=>'grid_wp_thegrid',
			'title'=>'Edit Grid',
			'href'=>add_query_arg(array('page'=>'grid','postid'=>$post->ID),admin_url('admin.php')),
		));
	}
}
add_action("admin_bar_menu","grid_wp_admin_bar",999);

function grid_wp_actions($actions,$entity)
{
	if(get_option("grid_".get_post_type()."_enabled",FALSE)==TRUE)
	{
		$actions['grid']='<a href="'.add_query_arg(array('page'=>'grid','postid'=>$entity->ID),admin_url('admin.php')).'">The Grid</a>';
	}
	return $actions;
}

add_filter("post_row_actions","grid_wp_actions",10,2);
add_filter("page_row_actions","grid_wp_actions",10,2);

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
	add_settings_section("grid_default_styles","Default Styles","grid_wp_default_styles_settings_section","grid_settings");
	add_settings_field("grid_default_container_style","Container Style","grid_wp_default_container_style_html","grid_settings","grid_default_styles");
	register_setting("grid_settings","grid_default_container_style");
	add_settings_field("grid_default_slot_style","Slot Style","grid_wp_default_slot_style_html","grid_settings","grid_default_styles");
	register_setting("grid_settings","grid_default_slot_style");
	add_settings_field("grid_default_box_style","Box Style","grid_wp_default_box_style_html","grid_settings","grid_default_styles");
	register_setting("grid_settings","grid_default_box_style");
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

	add_settings_section("grid_debug_mode","Debug Mode","grid_wp_debug_mode_section","grid_settings");
	add_settings_field("grid_debug_mode","Turn debug mode on/off","grid_wp_debug_mode_html","grid_settings","grid_debug_mode");
	register_setting("grid_settings","grid_debug_mode");

}
add_action("admin_init","grid_wp_admin_init");

function grid_wp_default_styles_settings_section()
{
	echo "Set which default styles should be applied.";
}

function grid_wp_default_container_style_html()
{
	$storage=grid_wp_get_storage();
	$types=$storage->fetchContainerStyles();
	$setting=get_option("grid_default_container_style","__NONE__");
?>
<select id="grid_default_container_style" name="grid_default_container_style">
<option value="__NONE__" <?php echo ($setting=="__NONE__"?"selected":"")?>>None</option>
<?php
	foreach($types as $idx=>$elem)
	{
?>
<option value="<?php echo $elem['slug'];?>" <?php echo ($elem['slug']==$setting?"selected":"");?>><?php echo $elem['title'];?></option>
<?php
	}
?>
</select>
<?
}

function grid_wp_default_slot_style_html()
{
	$storage=grid_wp_get_storage();
	$types=$storage->fetchSlotStyles();
	$setting=get_option("grid_default_slot_style","__NONE__");
?>
<select id="grid_default_slot_style" name="grid_default_slot_style">
<option value="__NONE__" <?php echo ($setting=="__NONE__"?"selected":"")?>>None</option>
<?php
	foreach($types as $idx=>$elem)
	{
?>
<option value="<?php echo $elem['slug'];?>" <?php echo ($elem['slug']==$setting?"selected":"");?>><?php echo $elem['title'];?></option>
<?php
	}
?>
</select>
<?
}

function grid_wp_default_box_style_html()
{
	$storage=grid_wp_get_storage();
	$types=$storage->fetchBoxStyles();
	$setting=get_option("grid_default_box_style","__NONE__");
?>
<select id="grid_default_box_style" name="grid_default_box_style">
<option value="__NONE__" <?php echo ($setting=="__NONE__"?"selected":"")?>>None</option>
<?php
	foreach($types as $idx=>$elem)
	{
?>
<option value="<?php echo $elem['slug'];?>" <?php echo ($elem['slug']==$setting?"selected":"");?>><?php echo $elem['title'];?></option>
<?php
	}
?>
</select>
<?
}

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

function grid_wp_debug_mode_section()
{
	echo "";
}

function grid_wp_debug_mode_html(){

	$value=get_option("grid_debug_mode",FALSE);
?>
<input type="checkbox" id="grid_debug_mode" name="grid_debug_mode" type=checkbox <?php echo ($value?"checked":"")?>> <?php echo ($value?"Enabled":"Disabled")?>
<?php
}

function grid_wp_add_meta_boxes()
{
	$post_types=get_post_types(array(),'objects');
	foreach($post_types as $key=>$post_type)
	{
		if(get_option("grid_".$key."_enabled",FALSE))
		{
			add_meta_box("grid",__("Grid"),"grid_wp_meta_box",$key);
		} 
 	}
}

add_action("add_meta_boxes","grid_wp_add_meta_boxes");

function grid_wp_meta_box($post)
{
	if(get_option("grid_".$post->post_type."_enabled",FALSE))
	{
	
	$url=add_query_arg(array('page'=>'grid','postid'=>$post->ID),admin_url('admin.php'));
?>
<a href="<?php echo $url?>">Switch to the Grid</a>
<?php
	}
	else
	{
		return FALSE;
	}
}

$grid_loaded=FALSE;

function grid_wp_get_storage()
{
	global $wpdb;
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
		$storage=new grid_db(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,$user->user_login,$wpdb->prefix);
		$storage->ajaxEndpoint=new grid_wordpress_ajaxendpoint();
		$storage->ajaxEndpoint->storage=$storage;
		$storage->templatesPath=get_template_directory().'/grid/';
		$storage->containerstyle=get_option("grid_default_container_style","__NONE__");
		if($storage->containerstyle=="__NONE__")
			$storage->containerstyle=NULL;
		$storage->slotstyle=get_option("grid_default_slot_style","__NONE__");
		if($storage->slotstyle=="__NONE__")
			$storage->slotstyle=NULL;
		$storage->boxstyle=get_option("grid_default_box_style","__NONE__");
		if($storage->boxstyle=="__NONE__")
			$storage->boxstyle=NULL;
		$grid_storage=$storage;	
		
	}
	return $grid_storage;

	
}

function grid_wp_thegrid()
{
	global $wpdb;
//	$storage=grid_wp_get_storage();
	$postid=$_GET['postid'];
	$rows=$wpdb->get_results("select grid_id from ".$wpdb->prefix."grid_nodes where nid=$postid");
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
		$wpdb->query("insert into ".$wpdb->prefix."grid_nodes (nid,grid_id) values ($postid,$id)");
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
		global $grid_lib;
		$css=$grid_lib->getEditorCSS(FALSE);
		foreach($css as $idx=>$file)
		{
			wp_enqueue_style('grid_css_'.$idx,plugins_url('lib/'.$file,__FILE__));
		}
		$lang=WPLANG;
		if(empty($lang))
			$lang="en";
		$js=$grid_lib->getEditorJS($lang,FALSE);
		foreach($js as $idx=>$file)
		{
			wp_enqueue_script('grid_js_'.$idx,plugins_url('lib/'.$file,__FILE__));
		}
		$html=$grid_lib->getEditorHTML(
			$grid_id,
			'grid',
			add_query_arg(array('noheader'=>true,'page'=>'grid_ckeditor_config'),admin_url('admin.php')),
			add_query_arg(array('noheader'=>true,'page'=>'grid_ajax'),admin_url('admin.php')),
			get_option('grid_debug_mode',FALSE),
			add_query_arg(array('grid_preview'=>true),get_permalink($postid)),
			add_query_arg(array('grid_preview'=>true,'grid_revision'=>'{REV}'),get_permalink($postid))
		);
		grid_wp_load_js();
		echo $html;
	}
}

function grid_wp_load_js(){
	// for wp.media and Backbone
	if(function_exists( 'wp_enqueue_media' )){
	    wp_enqueue_media();
	}else{
	    wp_enqueue_style('thickbox');
	    wp_enqueue_script('media-upload');
	    wp_enqueue_script('thickbox');
	}
}
function grid_wp_reuse_box_editor_prepare($editor)
{
	$css=$editor->getCSS(FALSE);
	foreach($css as $idx=>$file)
	{
		wp_enqueue_style("grid_reusebox_".$idx,plugins_url('lib/'.$file,__FILE__));
	}
	$lang=WPLANG;
	if(empty($lang))
		$lang='en';
	$js=$editor->getJS($lang,FALSE);
	foreach($js as $idx=>$file)
	{
		wp_enqueue_script("grid_reusebox_".$idx,plugins_url('lib/'.$file,__FILE__));
	}
}
function grid_wp_reuse_boxes()
{
	$storage=grid_wp_get_storage();
	global $grid_lib;
	$editor=$grid_lib->getReuseBoxEditor();
	grid_wp_reuse_box_editor_prepare($editor);
	$html=$editor->run($storage,function($id){
		return add_query_arg(array('page'=>'grid_edit_reuse_box','boxid'=>$id),admin_url('admin.php'));
	},function($id){
		return add_query_arg(array('noheader'=>true,'page'=>'grid_delete_reuse_box','boxid'=>$id),admin_url('admin.php'));
	});
	echo $html;
}

function grid_wp_edit_reuse_box()
{
	$boxid=$_GET['boxid'];
	global $grid_lib;
	$editor=$grid_lib->getReuseBoxEditor();
	grid_wp_reuse_box_editor_prepare($editor);
	$storage=grid_wp_get_storage();
	$html=$editor->runEditor(
		$storage,
		$boxid,
		add_query_arg(array('noheader'=>true,'page'=>'grid_ckeditor_config'),admin_url('admin.php')),
		add_query_arg(array('noheader'=>true,'page'=>'grid_ajax'),admin_url('admin.php')),
		get_option('grid_debug_mode',FALSE),
		''
	);
	echo $html;
}

function grid_wp_delete_reuse_box()
{
	$boxid=$_GET['boxid'];
	global $grid_lib;
	$editor=$grid_lib->getReuseBoxEditor();
	grid_wp_reuse_box_editor_prepare($editor);
	$storage=grid_wp_get_storage();
	$html=$editor->runDelete($storage,$boxid);
	if($html===TRUE)
	{
		wp_redirect(add_query_arg(array('page'=>'grid_reuse_boxes'),admin_url('tools.php')));
		return;		
	}
	echo $html;
}

function grid_wp_reuse_container_editor_prepare($editor)
{
	$css=$editor->getCSS(FALSE);
	foreach($css as $idx=>$file)
	{
		wp_enqueue_style("grid_reusecontainer_".$idx,plugins_url('lib/'.$file,__FILE__));
	}
	$lang=WPLANG;
	if(empty($lang))
		$lang='en';
	$js=$editor->getJS($lang,FALSE);
	foreach($js as $idx=>$file)
	{
		wp_enqueue_script("grid_reusecontainer_".$idx,plugins_url('lib/'.$file,__FILE__));
	}
}

function grid_wp_reuse_containers()
{
	$storage=grid_wp_get_storage();
	global $grid_lib;
	$editor=$grid_lib->getReuseContainerEditor();
	grid_wp_reuse_container_editor_prepare($editor);
	$html=$editor->run($storage,function($id){
		return add_query_arg(array('page'=>'grid_edit_reuse_container','containerid'=>$id),admin_url('admin.php'));
	},function($id){
		return add_query_arg(array('page'=>'grid_delete_reuse_container','containerid'=>$id,'noheader'=>true),admin_url('admin.php'));
	});
	echo $html;
}

function grid_wp_edit_reuse_container()
{
	$containerid=$_GET['containerid'];

	$storage=grid_wp_get_storage();
	global $grid_lib;
	$editor=$grid_lib->getReuseContainerEditor();
	grid_wp_reuse_container_editor_prepare($editor);
	grid_wp_load_js();
	$html=$editor->runEditor(
		$storage,
		$containerid,
		add_query_arg(array('noheader'=>true,'page'=>'grid_ckeditor_config'),admin_url('admin.php')),
		add_query_arg(array('noheader'=>true,'page'=>'grid_ajax'),admin_url('admin.php')),
		get_option('grid_debug_mode',FALSE),
		''
	);
	echo $html;
}

function grid_wp_delete_reuse_container()
{
	$containerid=$_GET['containerid'];

	$storage=grid_wp_get_storage();
	global $grid_lib;
	$editor=$grid_lib->getReuseContainerEditor();
	grid_wp_reuse_container_editor_prepare($editor);
	$html=$editor->runDelete($storage,$containerid);
	if($html===TRUE)
	{
		wp_redirect(add_query_arg(array('page'=>'grid_reuse_containers'),admin_url('tools.php')));
		return;
	}
	echo $html;
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
	$rows=$wpdb->get_results("select grid_id from ".$wpdb->prefix."grid_nodes where nid=$postid");
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
		$rows=$wpdb->get_results("select grid_id from ".$wpdb->prefix."grid_nodes where nid=$postid");
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
		wp_enqueue_style("grid_frontend",plugins_url('core/templates/default-frontend.css',__FILE__));
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
	global $grid_lib;
	echo $grid_lib->getCKEditorConfig($styles,$formats);
	die();
}

function grid_wp_get_mysqli(){
	$host = DB_HOST;
	$port = 3306;
	if(strpos(DB_HOST, ":") >= 0){
		$db_host = explode(":", DB_HOST);
		$host = $db_host[0];
		$port = $db_host[1];
	}
	return new mysqli($host,DB_USER,DB_PASSWORD,DB_NAME, $port);
}
