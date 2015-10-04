<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 20:58
 */


/**
 * wordpress plugin activate
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