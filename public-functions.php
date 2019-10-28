<?php

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
 * Drupal db_query function
 * @param $querystring
 * @return array|boolean
 */
// TODO: implement grid query function
function db_query( $querystring ) {
	global $wpdb;
	$querystring = str_replace( '{', $wpdb->prefix, $querystring );
	$querystring = str_replace( '}', '', $querystring );
	/**
	 * @var mysqli $grid_connection
	 */
	global $grid_connection;
	/**
	 * @var array|boolean $result
	 */
	try{
		$result = $grid_connection->query( $querystring );
		if ( false === $result ) {
			throw new Exception($grid_connection->error );
		}

		if ( is_object( $result ) ) {
			$return = array();
			while ( $row = $result->fetch_object() ) {
				$return[] = $row;
			}
			return $return;
		}
	} catch (Exception $e){
		error_log($e->getMessage()."\nQuerystring: $querystring\n", 4);
		wp_die("Error with grid db_query");
	}

	return false;
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
	return grid_plugin()->get_storage();
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
	return grid_plugin()->get_db_connection();
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
					if(isset($data['collate'])){
						$query .= ' COLLATE '.$data['collate'];
					}
				} elseif ( 'serial' == $fielddata['type'] ) {
					$query .= 'int ';
				} elseif ( 'varchar' == $fielddata['type'] ) {
					$query .= 'varchar('.$fielddata['length'].') ';
					if(isset($data['collate'])){
						$query .= ' COLLATE '.$data['collate'];
					}
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
				$query .= ' CHARSET '.$data['mysql_character_set'];
			}
			if( isset($data['collate'])){
				$query.= ' COLLATE='.$data['collate'];
			}
			try{
				$result = $grid_connection->query( $query );
				if($result === false){
					throw new Exception($query.' failed: '.$grid_connection->error );
				}
			} catch (Exception $e){
				error_log($e->getMessage(), 4);
				wp_die("Error with grid db_query");
			}


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
	grid_plugin()->init();
	global $wp_rewrite;
	$wp_rewrite->flush_rules();
}

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
	$grid_connection->close();
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