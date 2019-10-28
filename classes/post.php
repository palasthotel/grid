<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 21:21
 */

namespace Palasthotel\Grid\WordPress;


class post
{
	function __construct(){
		/**
		 * add body class
		 */
		add_filter('body_class', array($this, 'body_class'));
		/**
		 * load grid object to post
		 */
		add_action( 'the_post', array( $this, 'grid_load' ) );
		/**
		 * render the grid content
		 */
		add_filter( 'the_content', array( $this, 'grid_render'), 99 );
		/**
		 * prevent rendering grid content in excerpt
		 * if excerpt is empty get_the_excerpt filter will call wp_trim_excerpt code
		 * which will call the_content to extract the first part of it
		 * in this case grid may not be rendered
		 */
		add_filter( 'get_the_excerpt', array($this, 'no_grid_please'), 1);
		add_filter( 'get_the_excerpt', array($this, 'grid_again_please'), 99);
	}

	/**
	 * @param $cls
	 *
	 * @return mixed
	 */
	function body_class($cls){
				
		if( 
			get_the_ID() != false 
			&& 
		    	$this->post_has_grid(get_the_ID()) 
			&& 
		    	$this->post_should_show_grid(get_the_ID()) 
		){
			$cls[] = "has-grid";
		}
		return $cls;
	}

	/**
	 * @param $post_id
	 *
	 * @return bool
	 */
	function post_has_grid($post_id){
		global $wpdb;
		$count = $wpdb->get_var( 'select count(grid_id) from '.$wpdb->prefix."grid_nodes where nid=$post_id" );
		return( $count > 0 );
	}

	/**
	 * @param $post_id
	 *
	 * @return bool
	 */
	function post_should_show_grid($post_id){
		if ( get_option( 'grid_'.get_post_type($post_id).'_enabled', false ) ) {

			/**
			 * don't load grid if it is disabled
			 */
			if ( get_post_meta( $post_id, PositionInPost::META_KEY, true ) != PositionInPost::POSITION_NONE ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * add grid to post
	 *
	 * @param $post
	 *
	 */
	function grid_load( $post ) {
		global $wpdb;
		$postid = $post->ID;
		
		if ( get_option( 'grid_'.$post->post_type.'_enabled', false ) ) {
			
			/**
			 * don't load grid if it is disabled
			 */
			if(get_post_meta($post->ID, PositionInPost::META_KEY,true) == PositionInPost::POSITION_NONE) return;
			
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

			// get from hook
			$position = apply_filters(PositionInPost::FILTER_OVERWRITE, null, $post);
			// else get from meta
			if($position == null) $position = get_post_meta($post->ID, PositionInPost::META_KEY, true);

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
		$content_wrapper_class = array();
		$content_wrapper_class = apply_filters("grid_the_content_wrapper_class", $content_wrapper_class);
		if(!is_array($content_wrapper_class) || count($content_wrapper_class) < 1){
			return $content;
		}
		return "<div class='".implode(" ",$content_wrapper_class)."'>".$content."</div>";
	}

	/**
	 * remove filter for grid_render on the_content
	 *
	 * @param $content
	 *
	 * @return string
	 */
	function no_grid_please($content){
		remove_filter('the_content', array( $this, 'grid_render'), 99 );
		return $content;
	}

	/**
	 * add filter for grid_render on the_content
	 *
	 * @param $content
	 *
	 * @return string
	 */
	function grid_again_please($content){
		add_filter( 'the_content', array( $this, 'grid_render'), 99 );
		return $content;
	}

}
