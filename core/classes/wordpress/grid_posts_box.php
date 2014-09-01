<?php
// Posts-Box aka list of contents is considered a list
class grid_posts_box extends grid_list_box {
	
	function __construct() {
		// Constructor initializes editor widgets
		$this->content = new Stdclass();
		$this->content->viewmode = 'excerpt';
		$this->content->posts_per_page = 5;
		$this->content->offset = 0;
		$this->content->category = '';
		$this->content->post_type = 'post';
	}
	
	public function type() {
		// Sets box type
		return 'posts';
	}
	
	public function build( $editmode ) {
		if( $editmode ) {
			// Determines menu label of the box
			return 'Liste von Inhalten';
		} else {
			// Box renders its content in here
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
				$found = FALSE;
				// Checks if WordPress has a template for post content ...
				if ( $this->storage->templatesPath != NULL ) {
					if ( file_exists( $this->storage->templatesPath.'/post_content.tpl.php' ) ) {
						$found = TRUE;
						include $this->storage->templatesPath.'/post_content.tpl.php';
					}
				}
				// ... if not, uses Grid template for post content
				if ( ! $found ) {
					include dirname(__FILE__).'/../../templates/wordpress/post_content.tpl.php';
				}
				$output .= ob_get_clean();
				$counter ++;
				if($counter == $this->content->posts_per_page){
					break;
				}
			}
			wp_reset_postdata();
			return $output;
			// END of WordPress Loop
		}
	}
		
	public function contentStructure() {
		// Determines editor widgets used in backend
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
				'selections' => array( array( 'key' => 'excerpt', 'text' => 'Anriss' ), array( 'key' => 'full', 'text' => 'Voll' ) ),
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

	public function performElementSearch( $key, $query) {
		// Implements search for categories
		if ( $key != 'category' ) {
			return array( array( 'key' => -1, 'value' => 'invalid key' ) );
		}
		$categories = get_categories();
		$results = array();
		foreach ( $categories as $category ) {
			if ( $query == '' || strstr( $category->name, $query ) !== FALSE ) {
				$results[] = array( 'key' => $category->term_id, 'value' => $category->name );
			}
		}
		return $results;
	}

	public function getElementValue( $path, $id ) {
		// Gets categories
		if( $path != 'category' || $id == null || $id == "" ) {
			return '';
		} else {
			$thisCat = get_category( $id );
			return $thisCat->name;
		}
	}
}
