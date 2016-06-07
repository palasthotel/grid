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
		$dir = dirname(__FILE__);
		require( $dir.'/../core/classes/wordpress/grid_sidebar_box.php' );
		require( $dir.'/../core/classes/wordpress/grid_post_box.php' );
		require( $dir.'/../core/classes/wordpress/grid_media_box.php' );
		require( $dir.'/../core/classes/wordpress/grid_posts_box.php' );

		/**
		 * override html box
		 */
		require( $dir.'/../core/classes/wordpress/grid_wp_html_box.php' );
		add_filter('grid_boxes_search', array( $this, 'grid_boxes_search' ), 10, 3);

		add_filter( 'posts_where', array( $this, 'posts_where' ), 10, 2 );
	  
		$dirs = wp_upload_dir();
		\grid_rss_box::$CACHE_DIR = $dirs["basedir"]."/grid_rss_cache/";
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

	/**
	 * @param $where
	 * @param $wp_query
	 * @return string
	 */
	function posts_where( $where, &$wp_query )
	{
		global $wpdb;
		if ( $grid_title = $wp_query->get( 'grid_title' ) ) {
			$where .= ' AND ' . $wpdb->posts . '.post_title LIKE \'%' . $wpdb->esc_like( $grid_title ) . '%\'';
		}
		return $where;
	}
}