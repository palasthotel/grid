<?php
/**
 * Plugin Name: Grid
 * Plugin URI: https://github.com/palasthotel/grid-wordpress
 * Description: Helps layouting pages with containerist.
 * Version: 1.7.0
 * Author: Palasthotel <rezeption@palasthotel.de> (in person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 * Requires at least: 4.0
 * Tested up to: 4.9.1
 * License: http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @copyright Copyright (c) 2014, Palasthotel
 * @package Palasthotel\Grid-WordPress
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class grid_plugin {
	public $dir;
	public $url;
	
	/**
	 * construct grid plugin
	 */
	function __construct(){
		/**
		 * base paths
		 */
		$this->dir = plugin_dir_path(__FILE__);
		$this->url = plugin_dir_url(__FILE__);
		
		/**
		 * load constants
		 */
		require($this->dir .'/constants/position_in_post.php');
		
		
		/**
		 * load translations
		 */
		load_plugin_textdomain( 'grid', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

		global $grid_loaded;
		$grid_loaded = false;

		/**
		 * do stuff for wordpress spezific boxes
		 */
		require($this->dir .'/classes/boxes.inc');
		new \grid_plugin\boxes();

		/**
		 * the grid itself!
		 */
		require($this->dir .'/classes/the_grid.inc');
		new \grid_plugin\the_grid();

		/**
		 * Styles
		 */
		require($this->dir .'/classes/post.inc');
		$this->post = new \grid_plugin\post();

		/**
		 * meta boxes
		 */
		require( $this->dir .'/classes/meta_boxes.inc' );
		new \grid_plugin\meta_boxes();

		/**
		 * wp ajax endpoint
		 */
		$this->get_ajax_endpoint();

		/**
		 *  Grid settings pages
		 */
		require( $this->dir .'/classes/settings.inc' );
		new \grid_plugin\settings();

		/**
		 *  gird container factory
		 */
		require( $this->dir .'/classes/container_factory.inc');
		new \grid_plugin\container_factory();

		/**
		 *  gird container reuse
		 */
		require( $this->dir .'/classes/reuse_container.inc');
		new \grid_plugin\reuse_container();

		/**
		 *  gird box reuse
		 */
		require( $this->dir .'/classes/reuse_box.inc');
		new \grid_plugin\reuse_box();

		/**
		 *  gird privileges
		 */
		require( $this->dir .'/classes/privileges.inc');
		new \grid_plugin\privileges();

		/**
		 * Styles
		 */
		require( $this->dir .'/classes/styles.inc');
		new \grid_plugin\styles();

		add_action( 'wp_enqueue_scripts', array( $this, 'wp_head' ) );

		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * init grid to post types
	 */
	function init() {

		$options = get_option( 'grid', array() );
		if(isset($options['installed']))
		{
			global $grid_plugin;
			$grid_plugin->update();
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

	/**
	 * loads grid manually
	 * @param $post
	 */
	function grid_load($post){
		$this->post->grid_load($post);
	}

	/**
	 * frontend grid css
	 */
	function wp_head() {
		if ( file_exists( get_stylesheet_directory().'/grid/default-frontend.css' ) ) {
			// childtheme
			wp_enqueue_style( 'grid_frontend', get_stylesheet_directory_uri().'/grid/default-frontend.css' );
		} else	if ( file_exists( get_template_directory().'/grid/default-frontend.css' ) ) {
			// parent theme
			wp_enqueue_style( 'grid_frontend', get_template_directory_uri().'/grid/default-frontend.css' );
		} else {
			// default
			wp_enqueue_style( 'grid_frontend', admin_url( 'admin-ajax.php' ).'?action=gridfrontendCSS' );
		}
	}

	/**
	 * register wp grid endpoint
	 */
	function get_ajax_endpoint(){
		/**
		 * grid ajax endpoint once
		 */
		require_once( $this->dir .'/classes/ajaxendpoint.inc');
		return new \grid_plugin\ajaxendpoint();
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

	/**
	 * return grid id of post
	 * @param $postid
	 * @return bool
	 */
	function get_grid_by_postid( $postid ) {
		global $wpdb;
		$rows = $wpdb->get_results( 'select grid_id from '.$wpdb->prefix."grid_nodes where nid=$postid" );
		if ( count( $rows ) > 0 ) {
			return $rows[0]->grid_id;
		}
		return false;
	}

	function fire_hook($subject,$arguments) {
		do_action('grid_'.$subject,$arguments);
	}

	/**
	 * get grid storage
	 */
	function get_storage(){
		global $wpdb;
		global $grid_loaded;
		if ( ! $grid_loaded ) {
			do_action( 'grid_load_classes' );
			$grid_loaded = true;
		}
		global $grid_storage;
		if ( ! isset( $grid_storage ) ) {
			$user = wp_get_current_user();
			$storage = new grid_db( DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, $user->user_login, $wpdb->prefix, array($this,'fire_hook') );
			$storage->ajaxEndpoint = new \grid_plugin\ajaxendpoint();
			$storage->ajaxEndpoint->storage = $storage;

			// for old versions
			$storage->templatesPath = get_template_directory().'/grid/';

			$templatesPaths = array();
			$templatesPaths[] = get_stylesheet_directory().'/grid/';
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

	/**
	 * enqueue editor files
	 */
	function enqueue_editor_files($editor = null){
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
			$js = $grid_lib->getEditorJS($lang, false, false);
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

	/**
	 * update plugin
	 */
	function update(){
		global $grid_lib;
		global $grid_connection;

		$grid_connection = grid_wp_get_mysqli();

		$grid_lib->update();
		require_once($this->dir .'/grid-wordpress-update.inc');
		$wp_update = new grid_wordpress_update();
		$wp_update->performUpdates();
		$grid_connection->close();
	}
	/**
	 * get language
	 */
	function get_lang(){
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

	/**
	 * get connection to database
	 * @return mysqli
	 */
	function get_db_connection(){
		$host = DB_HOST;
		$port = 3306;
		if ( strpos( DB_HOST, ':' ) !== false ) {
			$db_host = explode( ':', DB_HOST );
			$host = $db_host[0];
			$port = intval($db_host[1]);
		}
		return new mysqli( $host, DB_USER, DB_PASSWORD, DB_NAME, $port );
	}
}

/**
 * init grid library for global use
 */
require( dirname(__FILE__).'/lib/grid.php' );
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
 * deprecated use
 * global $grid_plugin->get_postid_by_grid
 * @param $gridid
 * @return mixed
 */
function grid_wp_get_postid_by_grid($gridid) {
	global $grid_plugin;
	return $grid_plugin->get_postid_by_grid($gridid);
}

/**
 * get grid id by post id
 * deprecated use
 * global $grid_plugin->get_grid_by_postid
 * @param $postid
 * @return bool
 */
function grid_wp_get_grid_by_postid( $postid ) {
	global $grid_plugin;
	return $grid_plugin->get_grid_by_postid($postid);
}

/**
 * loads grid by post
 * deprecated use
 * global $grid_plugin->grid_load
 * @param $post
 */
function grid_wp_load($post){
	global $grid_plugin;
	$grid_plugin->grid_load($post);
}

/**
 * get grid privileges
 * @return mixed
 */
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



/**
 * deprecated function
 * use global $grid_plugin->get_storage()
 * @return grid_db grid_storage
 */
function grid_wp_get_storage() {
	global $grid_plugin;
	return $grid_plugin->get_storage();
}


function grid_wp_load_js() {
	// for wp.media
	wp_enqueue_script('jquery');
	if ( function_exists( 'wp_enqueue_media' ) ) {
		wp_enqueue_media();
	} else {
		wp_enqueue_style( 'thickbox' );
		wp_enqueue_script( 'media-upload' );
		wp_enqueue_script( 'thickbox' );
	}
}


/**
 * get db connection
 * deprecated use
 * global $grid_plugin->get_db_connection
 * @return mysqli
 */
function grid_wp_get_mysqli() {
	global $grid_plugin;
	return $grid_plugin->get_db_connection();
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
	global $grid_plugin;
	$grid_plugin->enqueue_editor_files($editor);
}

/**
 * get language
 * deprecated use
 * global $grid_plugin->get_lang
 * @return string
 */
function grid_get_lang(){
	global $grid_plugin;
	return $grid_plugin->get_lang();
}

/**
 * triggered on activate grid plugin
 */
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
			if( isset($data["unique keys"]) && is_array($data["unique keys"])){
				foreach($data["unique keys"] as $key_name => $key_columns){
					$query .= ', UNIQUE KEY '.$key_name.' ('.implode(', ', $key_columns).')';
				}
			}
			if( isset($data["indexes"]) && is_array($data["indexes"])){
				foreach($data["indexes"] as $key_name => $key_columns){
					$query .= ', INDEX '.$key_name.' ('.implode(', ', $key_columns).')';
				}
			}
			$query .= ') ';
			if ( isset( $data['mysql_engine'] ) ) {
				$query .= 'ENGINE = '.$data['mysql_engine'];
			}
			if ( isset( $data['mysql_character_set'] ) ) {
				if(isset( $data['mysql_engine'] ) ) {
					$query.=' , ';
				}
				$query .= 'CHARACTER SET '.$data['mysql_character_set'];
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
		/**
		 * default post types for grids
		 */
		update_option( 'grid_landing_page_enabled', true );
		update_option( 'grid_sidebar_enabled', true );
		/**
		 * default searchable post types in grid
		 */
		update_option( 'grid_post_search_enabled', true );
		update_option( 'grid_page_search_enabled', true );
		/**
		 * othter defaults
		 */
		update_option( 'grid_sidebar_post_type', 'sidebar' );
		update_option( 'grid_default_container', 'c-1d1' );
	}
	// for initial content type registration
	global $grid_plugin;
	$grid_plugin->init();
	global $wp_rewrite;
	$wp_rewrite->flush_rules();
}
register_activation_hook( __FILE__, 'grid_wp_activate' );

/**
 * plugin deleted by admin interface do this
 */
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
