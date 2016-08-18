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
		add_filter( 'the_content', array( $this, 'grid_render'), 99 );
	}

	/**
	 * add grid to post
	 * @param $post
	 */
	function grid_load( $post ) {
		global $wpdb;
		$postid = $post->ID;
		
		if ( get_option( 'grid_'.$post->post_type.'_enabled', false ) ) {
			
			/**
			 * don't load grid if it is disabled
			 */
			if(get_post_meta($post->ID, PositionInPost::META_KEY,true) == PositionInPost::POSITION_NONE) return false;
			
			/**
			 * look for grid id
			 */
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
		
		$content = $this->get_the_content_wrapper($content);
		
		if ( isset( $post->grid ) ) {
			$position = get_post_meta($post->ID, PositionInPost::META_KEY, true);
			switch ($position){
				/**
				 * render grid only
				 */
				case PositionInPost::POSITION_ONLY:
					return $post->grid->render( false );
				/**
				 * top position
				 */
				case PositionInPost::POSITION_TOP:
					return $post->grid->render( false ).$content;
				/**
				 * default ist bottom
				 */
				case PositionInPost::POSITION_BOTTOM:
				default:
					return $content.$post->grid->render( false );
			}
		}
		
		/**
		 * if nothing matched don't render grid on content
		 */
		return $content;

	}
	
	/**
	 * @param $content
	 *
	 * @return mixed
	 */
	function get_the_content_wrapper($content){
		if($content == "") return $content;
		$content_wrapper_class = array("grid-the-content");
		$content_wrapper_class = apply_filters("grid_the_content_wrapper_class", $content_wrapper_class);
		if(!is_array($content_wrapper_class) || count($content_wrapper_class) < 1){
			return $content;
		}
		return "<div class='".implode(" ",$content_wrapper_class)."'>".$content."</div>";
	}

}