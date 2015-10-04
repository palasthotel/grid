<?php
/**
 * Plugin Name: Grid
 * Plugin URI: https://github.com/palasthotel/grid/
 * Description: Helps layouting pages with containerist.
 * Version: 1.4.3
 * Author: Palasthotel <rezeption@palasthotel.de> (in person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 * Requires at least: 4.0
 * Tested up to: 4.3.1
 * License: http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @copyright Copyright (c) 2014, Palasthotel
 * @package Palasthotel\Grid-WordPress
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class grid_plugin {
	function __construct(){

		/**
		 * do stuff for wordpress spezific boxes
		 */
		require('classes/boxes.inc');
		new \grid_plugin\boxes();

		/**
		 * wp ajax endpoint
		 */
		$this->get_ajax_endpoint();

		/**
		 *  Grid settings pages
		 */
		require( 'classes/settings.inc' );
		new \grid_plugin\settings();

		/**
		 *  gird container factory
		 */
		require('classes/container_factory.inc');
		new \grid_plugin\container_factory();

		/**
		 *  gird privileges
		 */
		require('classes/privileges.inc');
		new \grid_plugin\privileges();

		/**
		 * Styles
		 */
		require('classes/styles.inc');
		new \grid_plugin\styles();
	}

	/**
	 * register wp grid endpoint
	 */
	function get_ajax_endpoint(){
		/**
		 * grid ajax endpoint once
		 */
		require_once('classes/ajaxendpoint.inc');
//		return new grid_wordpress_ajaxendpoint();
	}

	/**
	 * returns postid of grid
	 * @param $gridid
	 * @return mixed
	 */
	function get_postid_by_grid($gridid) {
		global $wpdb;
		$rows=$wpdb->get_results('select nid from '.$wpdb->prefix.'grid_nodes where grid_id='.$gridid);
		if(count($rows)>0)
		{
			return $rows[0]->nid;
		}
		return FALSE;
	}

}

/**
 * init grid library for global use
 */
require( 'lib/grid.php' );
global $grid_lib;
$grid_lib = new grid_library();

/**
 * init grid
 */
global $grid_plugin;
$grid_plugin = new grid_plugin();

/**
 * drupal t function
 *
 */
// TODO: use grid translate function
if ( ! function_exists( 't' ) ) {
	function t($str) { return __( $str, 'grid' ); }
}
/**
 * Drupal db_query function
 * @param $querystring
 * @param bool|true $die
 * @return array
 * @throws Exception
 */
// TODO: implement grid query function
function db_query( $querystring, $die = true ) {
	global $wpdb;
	$querystring = str_replace( '{', $wpdb->prefix, $querystring );
	$querystring = str_replace( '}', '', $querystring );
	global $grid_connection;
	if ( $die ) {
		$result = $grid_connection->query( $querystring ) or die( $querystring.' failed: '.$grid_connection->error );
	} else
	{
		$result = $grid_connection->query( $querystring );
		if ( false === $result ) {
			throw new Exception( $querystring.' failed: '.$grid_connection->error );
		}
	}
	if ( is_object( $result ) ) {
		$return = array();
		while ( $row = $result->fetch_object() ) {
			$return[] = $row;
		}
		return $return;
	}
	return $result;
}

/**
 * get postid by grid id
 * @param $gridid
 * @return mixed
 */
function grid_wp_get_postid_by_grid($gridid) {
	global $grid_plugin;
	return $grid_plugin->get_postid_by_grid($gridid);
}


function grid_wp_activate() {
	static $secondCall = false;
	global $wpdb;
	global $grid_connection;
	global $grid_lib;
	$grid_connection = grid_wp_get_mysqli();
	$options = get_option( 'grid', array() );
	if ( ! isset( $options['installed'] ) ) {
		$schema = $grid_lib->getDatabaseSchema();
		$schema['grid_nodes'] = array(
			'description' => t( 'references nodes' ),
			'fields' => array(
				'nid' => array(
					'description' => t( 'node id' ),
					'type' => 'int',
					'unsigned' => true,
					'not null' => true,
				),
				'grid_id' => array(
					'description' => t( 'grid id' ),
					'type' => 'int',
					'size' => 'normal',
					'unsigned' => true,
					'not null' => true,
				),
			),
			'primary key' => array( 'nid' ),
			'mysql_engine' => 'InnoDB',
		);
		
		foreach ( $schema as $tablename => $data ) {
			$query = 'create table if not exists '.$wpdb->prefix."$tablename (";
			$first = true;
			foreach ( $data['fields'] as $fieldname => $fielddata ) {
				if ( ! $first ) {
					$query .= ',';
				} else {
					$first = false;
				}
				$query .= "$fieldname ";
				if ( 'int' == $fielddata['type'] ) {
					$query .= 'int ';
				} elseif ( 'text' == $fielddata['type'] ) {
					$query .= 'text ';
				} elseif ( 'serial' == $fielddata['type'] ) {
					$query .= 'int ';
				} elseif ( 'varchar' == $fielddata['type'] ) {
					$query .= 'varchar('.$fielddata['length'].') ';
				} else {
					die( 'unknown type '.$fielddata['type'] );
				}
				if ( isset( $fielddata['unsigned'] ) && $fielddata['unsigned'] ) {
					$query .= ' unsigned';
				}
				if ( isset($fielddata['not null']) && $fielddata['not null'] ) {
					$query .= ' not null';
				}
				if ( 'serial' == $fielddata['type'] ) {
					$query .= ' auto_increment';
				}
			}
			if ( isset( $data['primary key'] ) ) {
				$query .= ',constraint primary key ('.implode( ',', $data['primary key'] ).')';
			}
			$query .= ') ';
			if ( isset( $data['mysql_engine'] ) ) {
				$query .= 'ENGINE = '.$data['mysql_engine'];
			}
			$grid_connection->query( $query ) or die( $grid_connection->error.' '.$query );

		}
		
		$grid_lib->install();

		require_once(dirname(__FILE__)."/grid-wordpress-update.inc");
		$wp_update = new grid_wordpress_update();
		$wp_update->install();

		$grid_connection->close();
		$options['installed'] = true;
		update_option( 'grid', $options );
		update_option( 'grid_landing_page_enabled', true );
		update_option( 'grid_sidebar_enabled', true );
		update_option( 'grid_sidebar_post_type', 'sidebar' );
		update_option( 'grid_default_container', 'c-1d1' );
	}
	// for initial content type registration
	grid_wp_init();
	global $wp_rewrite;
	$wp_rewrite->flush_rules();
}
register_activation_hook( __FILE__, 'grid_wp_activate' );

function grid_wp_update(){
	global $grid_lib;
	global $grid_connection;

	$grid_connection = grid_wp_get_mysqli();
	
	$grid_lib->update();
	require_once(dirname(__FILE__)."/grid-wordpress-update.inc");
	$wp_update = new grid_wordpress_update();
	$wp_update->performUpdates();
	$grid_connection->close();
}

function grid_wp_perform_uninstall()
{
	$posts=get_posts(array('post_type'=>'landing_page','posts_per_page'=>-1));
	foreach($posts as $post) {
		wp_delete_post($post->ID);
	}
	$posts=get_posts(array('post_type'=>'sidebar','posts_per_page'=>-1));
	foreach($posts as $post) {
		wp_delete_post($post->ID);
	}
	
	global $wpdb;
	global $grid_connection;
	global $grid_lib;
	$grid_connection = grid_wp_get_mysqli();

	delete_option('grid');
	delete_option('grid_landing_page_enabled');
	delete_option('grid_sidebar_enabled');
	delete_option('grid_sidebar_post_type');
	delete_option('grid_default_container');
	$schema = $grid_lib->getDatabaseSchema();
	$schema['grid_nodes']=array();
	$grid_lib->uninstall();
	foreach($schema as $tablename=>$data)
	{
		$query = 'drop table '.$wpdb->prefix.$tablename;
		$grid_connection->query( $query );
	}
}

function grid_wp_uninstall() {
	if(is_multisite())
	{
		global $wpdb;
		$blogids=$wpdb->get_col("SELECT blog_id FROM {$wpdb->blogs}");
		foreach($blogids as $blog_id)
		{
			switch_to_blog($blog_id);
			$grid=get_option('grid',array());
			if(isset($grid['installed']))
			{
				grid_wp_perform_uninstall();
			}
		}
	}
	else
	{		
		grid_wp_perform_uninstall();
	}
}
register_uninstall_hook(__FILE__,'grid_wp_uninstall');

function grid_wp_init() {

	$options = get_option( 'grid', array() );
	if(isset($options['installed']))
	{
		grid_wp_update();
	}

	do_action( 'grid_register_post_type' );
	// TODO register grid post types if enabled
	if(get_option("grid_landing_page_enabled", false)){	
		$permalink = get_option( 'grid_permalinks', '' );
		if ( '' == $permalink ) {
			$landing_page_permalink = _x( 'landing_page', 'slug', 'grid' );
		} else {
			$landing_page_permalink = $permalink;
		}

		register_post_type( 'landing_page',
			apply_filters( 'grid_register_post_type_landing_page',
				array(
					'labels'  => array(
					    'name'          => __( 'Landing Pages', 'grid' ),
					    'singular_name' => __( 'Landing Page', 'grid' ),
					    // labels to be continued
					    ),
					'menu_icon'			=>  plugins_url( 'images/post-type-icon.png', __FILE__),
					'description'       => __( 'This is where you can add new landing pages to your site.', 'grid' ),
					'public'            => true,
					'show_ui'           => true,
					'hierarchical'      => false, // Hierarchical causes memory issues - WP loads all records!
					'rewrite'           => $landing_page_permalink ? array( 
														'slug' => untrailingslashit( $landing_page_permalink ), 
														'with_front' => false, 
														'feeds' => true ) 
														: false,
					'supports' 			=> array( 'title', 'custom-fields', 'thumbnail', 'excerpt', 'comments', 'revisions', 'page-attributes' ),
					'show_in_nav_menus' => true,
				)
			)
		);
	}
	// TODO enable sidebar post type if enabled
	if(get_option("grid_sidebar_enabled", false)){

		register_post_type( 'sidebar',
			apply_filters( 'grid_register_post_type_landing_page',
				array(
					'labels'  => array(
						'name'          => __( 'Sidebars', 'grid' ),
						'singular_name' => __( 'Sidebar', 'grid' ),
						// labels to be continued
					),
					'menu_icon'			=>  plugins_url( 'images/post-type-icon.png', __FILE__),
					'description'       => __( 'This is where you can add new sidebars to your site.', 'grid' ),
					'public'            => true,
					'show_ui'           => true,
					'hierarchical'      => false, // Hierarchical causes memory issues - WP loads all records!
					'show_in_nav_menus' => false,
				)
			)
		);
	}
}
add_action( 'init', 'grid_wp_init' );


function grid_wp_admin_menu() {

	add_submenu_page( null, 'The Grid', 'The Grid', 'edit_posts', 'grid', 'grid_wp_thegrid' );
	add_submenu_page( null, 'Grid AJAX', 'The Grid AJAX', 'edit_posts', 'grid_ajax', 'grid_wp_ajax' );
	add_submenu_page( null, 'Grid CKEditor Config', 'Grid CKEditor Config', 'edit_posts', 'grid_ckeditor_config', 'grid_wp_ckeditor_config' );
	add_submenu_page( null, 'Grid Container slots CSS', 'Grid Conatiner slots CSS', 'edit_posts', 'grid_wp_container_slots_css', 'grid_wp_container_slots_css' );

	add_submenu_page( 'tools.php', 'Reusable grid boxes', 'Reusable grid boxes', 'edit_posts', 'grid_reuse_boxes', 'grid_wp_reuse_boxes' );
	add_submenu_page( null,'edit reuse box', 'edit reuse box', 'edit_posts', 'grid_edit_reuse_box', 'grid_wp_edit_reuse_box' );
	add_submenu_page( null, 'delete reuse box', 'delete reuse box', 'edit_posts', 'grid_delete_reuse_box', 'grid_wp_delete_reuse_box' );

	add_submenu_page( 'tools.php', 'reusable grid container', 'Reusable grid container', 'edit_posts', 'grid_reuse_containers', 'grid_wp_reuse_containers' );
	add_submenu_page( null, 'edit reuse container', 'edit reuse container', 'edit_posts', 'grid_edit_reuse_container', 'grid_wp_edit_reuse_container' );
	add_submenu_page( null, 'delete reuse container', 'delete reuse container', 'edit_posts', 'grid_delete_reuse_container', 'grid_wp_delete_reuse_container' );



}
add_action( 'admin_menu', 'grid_wp_admin_menu' );

function grid_wp_get_privs() {
	global $wp_roles;
	$names = $wp_roles->get_names();
	$ajaxendpoint = new grid_ajaxendpoint();
	$rights = $ajaxendpoint->Rights();
	$default = array();
	foreach ( $rights as $right ) {
		$defaults['administrator'][ $right ] = true;
		$defaults['editor'][ $right ] = true;
	}
	foreach ( $names as $key => $name ) {
		if ( ! isset( $defaults[ $key ] ) ) {
			foreach ( $rights as $right ) {
				$defaults[ $key ][ $right ] = false;
			}
		}
	}
	$privileges = get_option( 'grid_privileges', $defaults );
	return $privileges;
}


function grid_wp_admin_bar() {
	global $wp_admin_bar;
	global $post;
	if ( isset( $post->grid ) ) {
		$wp_admin_bar->add_node( array(
			'id' => 'grid_wp_thegrid',
			'title' => 'Edit Grid',
			'href' => add_query_arg( array( 'page' => 'grid', 'postid' => $post->ID ), admin_url( 'admin.php' ) ),
		) );
	}
}
add_action( 'admin_bar_menu', 'grid_wp_admin_bar', 999 );

function grid_wp_actions( $actions, $entity ) {
	if ( true == get_option( 'grid_'.get_post_type().'_enabled', false ) ) {
		$temp = array();
		$temp['grid'] = '<a href="'.add_query_arg( array( 'page' => 'grid', 'postid' => $entity->ID ), admin_url( 'admin.php' ) ).'">The Grid</a>';
		$actions = array_merge( $temp, $actions );
	}
	return $actions;
}
add_filter( 'post_row_actions', 'grid_wp_actions', 10, 2 );
add_filter( 'page_row_actions', 'grid_wp_actions', 10, 2 );


function grid_wp_add_meta_boxes() {
	$post_types = get_post_types( array(), 'objects' );
	foreach ( $post_types as $key => $post_type ) {
		if ( get_option( 'grid_'.$key.'_enabled', false ) ) {
			add_meta_box( 'grid', __( 'Grid' ), 'grid_wp_meta_box', $key, 'side', 'high' );
		}
	}
}

add_action( 'add_meta_boxes', 'grid_wp_add_meta_boxes' );

function grid_wp_meta_box( $post ) {
	if ( get_option( 'grid_'.$post->post_type.'_enabled', false ) ) {
		$url = add_query_arg( array( 'page' => 'grid', 'postid' => $post->ID ), admin_url( 'admin.php' ) );
?>
<a href="<?php echo $url?>">Switch to the Grid</a>
<?php
	} else {
		return false;
	}
}

$grid_loaded = false;

function grid_wp_get_storage() {
	global $wpdb;
	global $grid_loaded;
	if ( ! $grid_loaded ) {
		do_action( 'grid_load_classes' );
		$grid_loaded = true;
	}
	global $grid_storage;
	if ( ! isset( $grid_storage ) ) {
		$user = wp_get_current_user();
		$storage = new grid_db( DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, $user->user_login, $wpdb->prefix );
		$storage->ajaxEndpoint = new grid_wordpress_ajaxendpoint();
		$storage->ajaxEndpoint->storage = $storage;

		// for old versions
		$storage->templatesPath = get_template_directory().'/grid/';

		$templatesPaths = array();
		$templatesPaths[] = get_template_directory().'/grid/';
		$templatesPaths = apply_filters( 'grid_templates_paths', $templatesPaths );
		$templatesPaths[] = dirname(__FILE__)."/core/templates/wordpress";
		$storage->templatesPaths = $templatesPaths;
		
		$storage->containerstyle = get_option( 'grid_default_container_style', '__NONE__' );
		if ( '__NONE__' == $storage->containerstyle ) {
			$storage->containerstyle = null;
		}
		$storage->slotstyle = get_option( 'grid_default_slot_style', '__NONE__' );
		if ( '__NONE__' == $storage->slotstyle ) {
			$storage->slotstyle = null;
		}
		$storage->boxstyle = get_option( 'grid_default_box_style', '__NONE__' );
		if ( '__NONE__' == $storage->boxstyle ) {
			$storage->boxstyle = null;
		}
		$grid_storage = $storage;
	}
	return $grid_storage;
}

function grid_wp_thegrid() {
	global $wpdb;
	//	$storage=grid_wp_get_storage();
	$postid = intval($_GET['postid']);
	$rows = $wpdb->get_results( 'select grid_id from '.$wpdb->prefix."grid_nodes where nid=$postid" );
	if ( ! empty( $_POST ) ) {
		$storage = grid_wp_get_storage();
		$id = $storage->createGrid();
		$grid = $storage->loadGrid( $id );
		$post = get_post( $postid );
		if ( $post->post_type == get_option( 'grid_sidebar_post_type' ) ) {
			$grid->insertContainer( 'sc-1d3', 0 );
		} else if ( '__NONE__' != get_option( 'grid_default_container', '__NONE__' ) ) {
			$grid->insertContainer( get_option( 'grid_default_container' ), 0 );
		}
		$wpdb->query( 'insert into '.$wpdb->prefix."grid_nodes (nid,grid_id) values ($postid,$id)" );
		wp_redirect( add_query_arg( array( 'page' => 'grid', 'postid' => $postid ), admin_url( 'admin.php' ) ) );
	}
	if ( 0 == count( $rows ) ) {
?>
<form method="post" action="<?php echo add_query_arg( array( 'noheader' => true, 'page' => 'grid', 'postid' => $postid ), admin_url( 'admin.php' ) );?>">
<p>There is no grid. Boot one?</p>
<?php echo submit_button(); ?>
</form>
<?php
	} else {
		global $grid_lib;
		$grid_id = $rows[0]->grid_id;
		
		$post = get_post( $postid );

		grid_enqueue_editor_files();

		echo '<div class="wrap"><h2>'.$post->post_title.
		' <a title="Return to the post-edit page" class="add-new-h2"'.
		' href="'.admin_url("post.php?post=$postid&action=edit").'" >Edit Post</a'.
		'><a class="add-new-h2" href="'.
		get_permalink( $postid ).'">View Post</a></h2> </div>';

		$html = $grid_lib->getEditorHTML(
			$grid_id,
			'grid',
			add_query_arg( array( 'noheader' => true, 'page' => 'grid_ckeditor_config' ), admin_url( 'admin.php' ) ),
			add_query_arg( array( 'noheader' => true, 'page' => 'grid_ajax' ), admin_url( 'admin.php' ) ),
			get_option( 'grid_debug_mode', false ),
			add_query_arg( array( 'grid_preview' => true ), get_permalink( $postid ) ),
			add_query_arg( array( 'grid_preview' => true, 'grid_revision' => '{REV}' ), get_permalink( $postid ) )
		);

		
		grid_wp_load_js();
		
		echo $html;
	}
}


function grid_wp_load_js() {
	// for wp.media
	if ( function_exists( 'wp_enqueue_media' ) ) {
		wp_enqueue_media();
	} else {
		wp_enqueue_style( 'thickbox' );
		wp_enqueue_script( 'media-upload' );
		wp_enqueue_script( 'thickbox' );
	}
}

function grid_wp_reuse_boxes() {
	$storage = grid_wp_get_storage();
	global $grid_lib;
	$editor = $grid_lib->getReuseBoxEditor();
	grid_enqueue_editor_files($editor);
	$html = $editor->run( $storage, function( $id ) {
				return add_query_arg( array( 'page' => 'grid_edit_reuse_box', 'boxid' => $id ), admin_url( 'admin.php' ) );
			}, function( $id ) {
				return add_query_arg( array( 'noheader' => true, 'page' => 'grid_delete_reuse_box', 'boxid' => $id ), admin_url( 'admin.php' ) );
			});
	echo $html;
}

function grid_wp_edit_reuse_box() {
	$boxid = intval($_GET['boxid']);
	global $grid_lib;
	$editor = $grid_lib->getReuseBoxEditor();
	grid_enqueue_editor_files($editor);
	$storage = grid_wp_get_storage();
	grid_wp_load_js();
	$html = $editor->runEditor(
		$storage,
		$boxid,
		add_query_arg( array( 'noheader' => true, 'page' => 'grid_ckeditor_config' ), admin_url( 'admin.php' ) ),
		add_query_arg( array( 'noheader' => true, 'page' => 'grid_ajax' ), admin_url( 'admin.php' ) ),
		get_option( 'grid_debug_mode', false ),
		''
	);
	echo $html;
}

function grid_wp_delete_reuse_box() {
	$boxid = intval($_GET['boxid']);
	global $grid_lib;
	$editor = $grid_lib->getReuseBoxEditor();
	grid_enqueue_editor_files($editor);
	$storage = grid_wp_get_storage();
	$html = $editor->runDelete( $storage, $boxid );
	if ( true === $html ) {
		wp_redirect( add_query_arg( array( 'page' => 'grid_reuse_boxes' ), admin_url( 'tools.php' ) ) );
		return;
	}
	echo $html;
}



function grid_wp_reuse_containers() {
	$storage = grid_wp_get_storage();
	global $grid_lib;
	$editor = $grid_lib->getReuseContainerEditor();
	grid_enqueue_editor_files($editor);
	$html = $editor->run( $storage, function( $id ) {
				return add_query_arg( array( 'page' => 'grid_edit_reuse_container', 'containerid' => $id ), admin_url( 'admin.php' ) );
			}, function( $id ) {
				return add_query_arg( array( 'page' => 'grid_delete_reuse_container', 'containerid' => $id, 'noheader' => true ), admin_url( 'admin.php' ) );
			} );
	echo $html;
}

function grid_wp_edit_reuse_container() {
	$containerid = intval($_GET['containerid']);

	$storage = grid_wp_get_storage();
	global $grid_lib;
	$editor = $grid_lib->getReuseContainerEditor();
	grid_enqueue_editor_files( $editor );
	grid_wp_load_js();
	$html = $editor->runEditor(
		$storage,
		$containerid,
		add_query_arg( array( 'noheader' => true, 'page' => 'grid_ckeditor_config' ), admin_url( 'admin.php' ) ),
		add_query_arg( array( 'noheader' => true, 'page' => 'grid_ajax' ), admin_url( 'admin.php' ) ),
		get_option( 'grid_debug_mode', false ),
		''
	);
	echo $html;
}

function grid_wp_delete_reuse_container() {
	$containerid = intval($_GET['containerid']);

	$storage = grid_wp_get_storage();
	global $grid_lib;
	$editor = $grid_lib->getReuseContainerEditor();
	grid_enqueue_editor_files( $editor );
	$html = $editor->runDelete( $storage, $containerid );
	if ( true === $html ) {
		wp_redirect( add_query_arg( array( 'page' => 'grid_reuse_containers' ), admin_url( 'tools.php' ) ) );
		return;
	}
	echo $html;
}

function grid_wp_ajax() {
	$storage = grid_wp_get_storage();
	$storage->handleAjaxCall();
	die();
}

function grid_wp_get_grid_by_postid( $postid ) {
	global $wpdb;
	$rows = $wpdb->get_results( 'select grid_id from '.$wpdb->prefix."grid_nodes where nid=$postid" );
	if ( count( $rows ) > 0 ) {
		return $rows[0]->grid_id;
	}
	return false;
}

function grid_wp_load( $post ) {
	global $wpdb;
	$postid = $post->ID;
	if ( get_option( 'grid_'.$post->post_type.'_enabled', false ) ) {
		$rows = $wpdb->get_results( 'select grid_id from '.$wpdb->prefix."grid_nodes where nid=$postid" );
		if ( $wpdb->num_rows > 0 ) {
			$grid_id = $rows[0]->grid_id;
			$storage = grid_wp_get_storage();
			$grid = null;
			if ( isset( $_GET['grid_preview'] ) && intval($_GET['grid_preview']) ) {
				if ( isset( $_GET['grid_revision'] ) ) {
					$revision = intval($_GET['grid_revision']);
					$grid = $storage->loadGridByRevision( $grid_id, $revision );
				} else {
					$grid = $storage->loadGrid( $grid_id );
				}
			} else {
				$grid = $storage->loadGrid( $grid_id, false );
			}
			$post->grid = $grid;
		}
	}
}
add_action( 'the_post', 'grid_wp_load' );

function grid_wp_render( $content ) {
	$post = get_post();

	if ( isset( $post->grid ) ) {
		return $content.$post->grid->render( false );
	}
	else {
		return $content;
	}
}
add_filter( 'the_content', 'grid_wp_render' );

function grid_wp_head() {
	if ( file_exists( get_template_directory().'/grid/default-frontend.css' ) ) {
		wp_enqueue_style( 'grid_frontend', get_template_directory_uri().'/grid/default-frontend.css' );
	} else {
		wp_enqueue_style( 'grid_frontend', admin_url( 'admin-ajax.php' ).'?action=gridfrontendCSS' );
	}
}
add_action( 'wp_enqueue_scripts', 'grid_wp_head' );

add_action( 'wp_ajax_gridfrontendCSS', 'grid_wp_container_slots_css' );
add_action( 'wp_ajax_nopriv_gridfrontendCSS', 'grid_wp_container_slots_css' );

function grid_wp_container_slots_css() {
	global $grid_lib;
	global $wpdb;
	$rows = $wpdb->get_results( 'select * from '.$wpdb->prefix.'grid_container_type' );
	echo $grid_lib->getContainerSlotCSS( $rows );
	die();
}

function grid_wp_ckeditor_config() {
	$styles = array();
	$formats = array();

	$styles = apply_filters( 'grid_styles', $styles );
	$styles = apply_filters( 'grid_formats', $formats );
	global $grid_lib;
	echo $grid_lib->getCKEditorConfig( $styles, $formats );
	die();
}

function grid_wp_get_mysqli() {
	$host = DB_HOST;
	$port = 3306;
	if ( strpos( DB_HOST, ':' ) !== false ) {
		$db_host = explode( ':', DB_HOST );
		$host = $db_host[0];
		$port = intval($db_host[1]);
	}
	return new mysqli( $host, DB_USER, DB_PASSWORD, DB_NAME, $port );
}

add_action( 'admin_head-options-reading.php', 'grid_modify_front_pages_dropdown' );
add_action( 'pre_get_posts', 'grid_enable_front_page_landing_page' );

function grid_modify_front_pages_dropdown()
{
	// Filtering /wp-includes/post-templates.php#L780
	add_filter( 'get_pages', 'grid_add_landing_page_to_pages_on_front' );
}

function grid_add_landing_page_to_pages_on_front( $r )
{
	$args = array(
		'post_type' => 'landing_page',
	);
	$stacks = get_posts( $args );
	$r = array_merge( $r, $stacks );

	return $r;
}

function grid_enable_front_page_landing_page( $query )
{
	if ( ( ! isset($query->query_vars['post_type'] ) || $query->query_vars['post_type'] == '' ) && 0 != $query->query_vars['page_id'] ) {
		$query->query_vars['post_type'] = array( 'page', 'landing_page' );
	}
}

/**
 * returns additional editor widget files
 * @return  array js and css key are arrays of file paths
 */
function grid_get_additional_editor_widgets(){
	return apply_filters('grid_editor_widgets', array( "js" => array(), "css"=> array() ) );
}
/**
 * enqueue js and css files for editor
 */
function grid_enqueue_editor_files($editor = null){
	global $grid_lib;
	/**
	 * get editor or default
	 */
	$css = array();
	if(null != $editor ){
		$css = $editor->getCSS( false );
	} else {
		$css = $grid_lib->getEditorCSS( false );
	}
	/**
	 * enqueue the css array
	 */
	foreach ( $css as $idx => $file ) {
		wp_enqueue_style( 'grid_css_lib_'.$idx,plugins_url( 'lib/'.$file, __FILE__ ) );
	}
	wp_enqueue_style( 'grid_wordpress_css', plugins_url( 'grid-wordpress.css', __FILE__ ) );
	wp_enqueue_style( 'grid_wordpress_container_slots_css', add_query_arg( array( 'noheader' => true, 'page' => 'grid_wp_container_slots_css' ), admin_url( 'admin.php' ) ) );

	/**
	 * get editor or default
	 */
	$lang = grid_get_lang();
	$js = array();
	if(null != $editor){
		$js = $editor->getJS( $lang, false );
	} else {
		$js = $grid_lib->getEditorJS($lang, false);
	}
	/**
	 * enqueue the js array
	 */
	foreach ( $js as $idx => $file ) {
		wp_enqueue_script( 'grid_js_lib_'.$idx, plugins_url( 'lib/'.$file, __FILE__ ) );
	}
	wp_enqueue_script( 'grid_wordpress_js', plugins_url( 'grid-wordpress.js', __FILE__ ) );

	/**
	 * get additional widgets arrays (css | js)
	 */
	$editor_widgets = grid_get_additional_editor_widgets();
	/**
	 * extend widgets css with editor css filter
	 */
	foreach ( $editor_widgets["css"] as $key => $url ) {
		wp_enqueue_style( 'grid_css_'.$key, $url );
	}
	/**
	 * extend widgets js
	 */
	foreach ( $editor_widgets["js"] as $key => $url ) {
		wp_enqueue_script( 'grid_js_'.$key, $url );
	}

	
}

function grid_get_lang(){
	if( defined('WPLANG') )
	{
		$lang = WPLANG;
	}
	if(!empty($lang))
	{
		return $lang;
	} 
	return 'en';
}

