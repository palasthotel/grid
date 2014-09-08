<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */
/** 
* Meta type "CONTENT"
*
* Creates a new meta type used as category for boxes. 
*/
class grid_post_box extends grid_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'post';
	}

	/**
	* Box renders its menu label and its content in here.
	*
	* @uses array date("Y-m-d h:i:s",$post->post_date).")
	*
	* @return string
	*/
	public function build( $editmode ) {
		$post = get_post( $this->content->postid ); // Returns post id or FALSE
		if ( $post == FALSE ) {
			return 'Post is lost';
		}
		if ( $editmode ) {
			return $post->post_type.': '.$post->post_title.' ('.$post->post_date.')';
		} else {
			// START of WordPress Loop
			$query = new WP_Query( array( 'p' => $this->content->postid, 'post_type' => array( 'post', 'page' ) ) );
			if ( $query->have_posts() ) {
				$query->the_post();
				ob_start();
				$found = FALSE;
				if( $this->storage->templatesPath != NULL ) {
					if( file_exists( $this->storage->templatesPath.'/post_content.tpl.php' ) ) {
						$found = TRUE;
						include $this->storage->templatesPath.'/post_content.tpl.php';
					}
				}
				if ( ! $found ) {
					include dirname(__FILE__).'/../../templates/wordpress/post_content.tpl.php';
				}
				$output = ob_get_clean();
				wp_reset_postdata();
				return $output;
			// END of WordPress Loop
			}
		}
	}
	
	/**
	* Checks if class is meta type
	*
	* Makes post_box a meta type
	*
	* @return boolean
	*/
	public function isMetaType() {
		return TRUE;
	}
	
	/**
	* Determines name of meta type that is shown in Grid menu
	*
	* @return string
	*/
	public function metaTitle() {
		return t( 'Contents' );
	}
	
	/**
	* Criteria for meta search
	*
	* @return string[]
	*/
	public function metaSearchCriteria() {
		return array( 'title' );
	}
	
	/**
	* Implements meta search
	*
	* @param string $criteria
	*
	* @param mixed $search
	*
	* @return array
	*/
	public function metaSearch( $criteria, $search ) {
		if( $search == '' ) {
			return array();
		}
		$results = array();
		// START of WordPress Loop
		$query = new WP_Query( array( 'post_type' => array( 'post', 'page' ), 'grid_title'=>$search ) );
		while ( $query->have_posts() ) {
			$query->the_post();
			$post = get_post();
			$box = new grid_post_box();
			$box->content = new StdClass();
			$box->content->viewmode = 'excerpt';
			$box->content->postid = $post->ID;
			$results[] = $box;
		}
		wp_reset_postdata();
		return $results;
		// END of WordPress Loop
	}
	
	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure () {
		$params=array(
			array(
				'key' => 'viewmode',
				'type' => 'select',
				'label' => 'Ansicht',
				'selections' => array( array( 'key' => 'excerpt', 'text' => 'Anriss' ), array( 'key' => 'full', 'text' => 'Voll' ) ),
			),
			array(
				'key' => 'postid',
				'type' => 'hidden',
			),
		);
		return $params;
	}
}
