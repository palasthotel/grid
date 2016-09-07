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
		parent::__construct();

		$viewmodes = $this->getViewmodes();
		if(count($viewmodes)>0 && !empty($viewmodes[0]) && !empty($viewmodes[0]['key'])){
			$this->content->viewmode = $viewmodes[0]['key'];
		} else {
			$this->content->viewmode = 'excerpt';
		}

		$this->content->posts_per_page = 5;
		$this->content->offset = 0;
		$this->content->post_type = 'post';
		$this->content->relation = 'OR';
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
			return $this->content;
		} else {
			$args = array();
			// Checks if catergory is set
			/**
			 * generate taxonomy
			 */
			$tax_query = array();
			foreach($this->content as $field => $value){
				if(''== $value || strpos($field,"tax_") !== 0) continue;
				$tax_query[] = array(
					'taxonomy' => $this->getTaxonomyNameByKey($field),
					'terms' => $value,
				);
			}
			/**
			 * add relation if more than one term was selected
			 */
			if(count($tax_query)>1){
				$tax_query["relation"] = "OR";
				if(!empty($this->content->relation)){
					$tax_query["relation"] = $this->content->relation;
				}
			}
			/**
			 * add to args if there are tax_query items
			 */
			if(count($tax_query)>0){
				$args['tax_query'] = $tax_query;
			}

			// START legacy support for category
			if ( isset( $this->content->category ) && $this->content->category != '' ) {
				$args['cat'] = $this->content->category;
			}
			// ENDE legacy support for category

			/**
			 * add other stuff to args
			 */
			$args['posts_per_page'] = $this->content->posts_per_page;
			$args['offset'] = $this->content->offset;
			$args['post_type'] = $this->content->post_type;
			
			/**
			 * if avoid doublets plugin is activated
			 */
			if(function_exists('grid_avoid_doublets_get_placed')){
				$args["post__not_in"] = grid_avoid_doublets_get_placed();
			}
			return $args;
		}
	}

	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure() {
		$cs = parent::contentStructure();

		$viewmodes = $this->getViewmodes();
		if(count($viewmodes) > 0){
			$cs[] = array(
				'key' => 'viewmode',
				'type' => 'select',
				'label' => t('Viewmode'),
				'selections' => $viewmodes,
			);
		}

		/**
		 * posts per page
		 */
		$cs[] = array(
			'key' => 'posts_per_page',
			'label' => t( 'Posts per page' ),
			'type' => 'number',
		);

		/**
		 * offset
		 */
		$cs[] = array(
			'key' => 'offset',
			'label' => t( 'Offset' ),
			'type' => 'number',
		);

		/**
		 * taxonomies
		 */
		$taxonomies = get_taxonomies(array(
			'public'=>true,
		), 'object');
		foreach($taxonomies as $tax){
			/**
			 * post format is a special case so ignore
			 */
			if('post_format'==$tax->name) continue;
			/**
			 * add taxonomy to content structure
			 */
			$cs[] = array(
				'key' => $this->getTaxonomyKey($tax),
				'label' => $tax->label,
				'type' => 'autocomplete',
			);
		}

		/**
		 * relation type
		 */
		$cs[] = array(
			'key' => 'relation',
			'label' => 'Term relation type',
			'type' => 'select',
			'selections' => array(
				array('key' => 'OR', 'text' => 'OR: all post with one or more of these terms'),
				array('key' => 'AND', 'text' => 'AND: all posts that have all of these terms'),
			),
		);

		/**
		 * post type select
		 */
		$post_types = array();
		$input = get_post_types( array(), 'objects' );
		foreach ( $input as $post_type => $info ) {
			$post_types[] = array( 'key' => $post_type, 'text' => $info->labels->name );
		}
		$post_types[] = array( 'key' => 'any', 'text' => __('Any post type') );
		$cs[] = array(
			'key' => 'post_type',
			'label' => t( 'Post type' ),
			'type' => 'select',
			'selections' => $post_types,
		);



		return $cs;
	}

	public function getViewmodes(){
		$viewmodes = array(
			array('key' => 'excerpt', 'text' => t('Excerpt') ),
			array('key' => 'full', 'text' => t('Full') ),
		);
		return apply_filters('grid_post_viewmodes',$viewmodes);
	}

	/**
	 * content structure key for taxonomy
	 * @param $taxonomy
	 * @return string
	 */
	public function getTaxonomyKey($taxonomy){
		return 'tax_'.$taxonomy->name;
	}

	/**
	 * taxonomyname from constent structure key
	 * @param $key
	 * @return mixed
	 */
	public function getTaxonomyNameByKey($key){
		return str_replace("tax_","", $key);
	}

	/**
	* Implements search for categories
	*
	* @param string $path
	*
	* @param string $query
	*
	* @return array
	*/
	public function performElementSearch( $path, $query) {
		$taxonomy = $this->getTaxonomyNameByKey($path);
		if(!taxonomy_exists($taxonomy)){
			return array( array( 'key' => -1, 'value' => 'invalid key:'.$path ) );
		}
		$categories = get_terms($taxonomy, array(
			'hide_empty' => false,
		));
		$results = array();
		foreach ( $categories as $category ) {
			if (
				$query == ''
				|| false !== strstr( strtolower( $category->name ) , strtolower( $query ) )
				|| false !== strstr( strtolower( $category->label ) , strtolower( $query ) )
			) {
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
		$taxonomy = $this->getTaxonomyNameByKey($path);
		if( !taxonomy_exists($taxonomy) || $id == null || $id == '' ){
			return t('Taxonomy does not exist') . ': ' . $taxonomy;
		} else {
			$term = get_term( $id, $taxonomy );
			return $term->name;
		}
	}
}
