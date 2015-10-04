<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 13:20
 */

namespace grid_plugin;


class boxes
{
	function __construct(){
		require( 'core/classes/wordpress/grid_sidebar_box.php' );
		require( 'core/classes/wordpress/grid_post_box.php' );
		require( 'core/classes/wordpress/grid_media_box.php' );
		require( 'core/classes/wordpress/grid_posts_box.php' );

		/**
		 * override html box
		 */
		require( 'core/classes/wordpress/grid_wp_html_box.php' );
		add_filter('grid_boxes_search', array( $this, 'grid_boxes_search' ), 10, 3);
	}

	/**
	 * filter grid boxes on meta search
	 * @param $result
	 * @param $grid_id
	 * @param $post_id
	 * @return mixed
	 */
	function grid_boxes_search($result, $grid_id, $post_id){
		for ($i=0; $i < count($result) ; $i++) {
			if($result[$i]["type"] == "html") array_splice($result,$i,1);
		}
		return $result;
	}
}