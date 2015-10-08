<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 21:21
 */

namespace grid_plugin;


class post
{
	function __construct(){
		add_action( 'the_post', array( $this, 'grid_load' ) );
		add_filter( 'the_content', array( $this, 'grid_render') );
	}

	/**
	 * add grid to post
	 * @param $post
	 */
	function grid_load( $post ) {
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

	/**
	 * render grid to content
	 * @param $content
	 * @return string
	 */
	function grid_render( $content ) {
		$post = get_post();

		if ( isset( $post->grid ) ) {
			return $content.$post->grid->render( false );
		}
		else {
			return $content;
		}
	}

}