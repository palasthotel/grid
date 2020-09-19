<?php

use Palasthotel\Grid\Endpoint;
use Palasthotel\Grid\Storage;
use Palasthotel\Grid\WordPress\Plugin;

/**
 * @return \Palasthotel\Grid\Wordpress\Plugin
 */
function grid_plugin(){
	return Plugin::instance();
}

/**
 * drupal t function
 *
 */
// TODO: use grid translate function
if ( ! function_exists( 't' ) ) {
	function t( $str ) {
		return __( $str, Plugin::DOMAIN );
	}
}

/**
 * get postid by grid id
 * deprecated use
 * global $grid_plugin->get_postid_by_grid
 * @param $gridid
 * @return mixed
 */
function grid_wp_get_postid_by_grid($gridid) {
	return grid_plugin()->get_postid_by_grid($gridid);
}

/**
 * get grid id by post id
 * deprecated use
 * global $grid_plugin->get_grid_by_postid
 * @param $postid
 * @return bool
 */
function grid_wp_get_grid_by_postid( $postid ) {
	return grid_plugin()->get_grid_by_postid($postid);
}

/**
 * loads grid by post
 * deprecated use
 * global $grid_plugin->grid_load
 * @param $post
 */
function grid_wp_load($post){
	grid_plugin()->grid_load($post);
}

/**
 * get grid privileges
 * @return mixed
 */
function grid_wp_get_privs() {
	global $wp_roles;
	$names = $wp_roles->get_names();
	$ajaxendpoint = new Endpoint();
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
 * @return Storage grid_storage
 */
function grid_wp_get_storage() {
	return grid_plugin()->gridCore->storage;
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
	return grid_plugin()->gridQuery->connection;
}


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
	grid_plugin()->enqueue_editor_files($editor);
}

/**
 * get language
 * deprecated use
 * global $grid_plugin->get_lang
 * @return string
 */
function grid_get_lang(){
	return grid_plugin()->get_lang();
}