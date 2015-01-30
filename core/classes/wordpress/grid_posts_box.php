<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */
/**
* Posts-Box is considered a list
*
* In the Grid selection menu, Posts-Box is named "List Of Contents".
*/
class grid_posts_box extends grid_list_box {

	/**
	* Class contructor
	*
	* Initializes editor widgets for backend
	*/
	function __construct() {
		$this->content = new Stdclass();
		$this->content->viewmode = 'excerpt';
		$this->content->posts_per_page = 5;
		$this->content->offset = 0;
		$this->content->category = '';
		$this->content->post_type = 'post';
	}

	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'posts';
	}

	/**
	* Box renders its menu label and its content in here.
	*
	* @param boolean $editmode
	*
	* @return string
	*/
	public function build( $editmode ) {
		if ( $editmode ) {
			return 'Liste von Inhalten';
		} else {
			$args = array();
			// Checks if catergory is set
			if ( isset( $this->content->category ) && $this->content->category != '' ) {
				$args['cat'] = $this->content->category;
			}
			$args['posts_per_page'] = $this->content->posts_per_page;
			$args['offset'] = $this->content->offset;
			$args['post_type'] = $this->content->post_type;
			$output = '';
			// START of WordPress Loop
			$query = new WP_Query( $args );
			$counter = 0;
			while ( $query->have_posts() ) {
				$query->the_post();
				ob_start();
				$found = false;
				// Checks if WordPress has a template for post content ...
				if ( $this->storage->templatesPath != null ) {
					if ( file_exists( $this->storage->templatesPath.'/post_content.tpl.php' ) ) {
						$found = true;
						include $this->storage->templatesPath.'/post_content.tpl.php';
					}
				}
				// ... if not, uses Grid template for post content
				if ( ! $found ) {
					include dirname( __FILE__ ).'/../../templates/wordpress/post_content.tpl.php';
				}
				$output .= ob_get_clean();
				$counter ++;
				if ( $counter == $this->content->posts_per_page ){
					break;
				}
			}
			wp_reset_postdata();
			return $output;
			// END of WordPress Loop
		}
	}

	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure() {
		$post_types = array();
		$input = get_post_types( array(), 'objects' );
		foreach ( $input as $post_type => $info ) {
			$post_types[] = array( 'key' => $post_type, 'text' => $info->labels->name );
		}
		return array(
			array(
				'key' => 'viewmode',
				'type' => 'select',
				'label' => t( 'Viewmode' ),
				'selections' => array( array( 'key' => 'excerpt', 'text' => t('Excerpt' ) ) , array( 'key' => 'full', 'text' => t('Full') ) ),
			),
			array(
				'key' => 'posts_per_page',
				'label' => t( 'Posts per page' ),
				'type' => 'number',
			),
			array(
				'key' => 'offset',
				'label' => t( 'Offset' ),
				'type' => 'number',
			),
			array(
				'key' => 'category',
				'label' => t( 'Category' ),
				'type' => 'autocomplete',
			),
			array(
				'key' => 'post_type',
				'label' => t( 'Post type' ),
				'type' => 'select',
				'selections' => $post_types,
			),
		);
	}

	/**
	* Implements search for categories
	*
	* @param integer $key
	*
	* @param string $query
	*
	* @return array
	*/
	public function performElementSearch( $key, $query) {
		if ( 'category' != $key ) {
			return array( array( 'key' => -1, 'value' => 'invalid key' ) );
		}
		$categories = get_categories();
		$results = array();
		foreach ( $categories as $category ) {
			if ( $query == '' || false !== strstr( strtolower( $category->name ) , strtolower( $query ) ) ) {
				$results[] = array( 'key' => $category->term_id, 'value' => $category->name );
			}
		}
		return $results;
	}

	/**
	* Gets categories
	*
	* @param string $path
	*
	* @param integer $id
	*
	* @return string
	*/
	public function getElementValue( $path, $id ) {
		if ( 'category' != $path || $id == null || $id == '' ) {
			return '';
		} else {
			$thisCat = get_category( $id );
			return $thisCat->name;
		}
	}
}
