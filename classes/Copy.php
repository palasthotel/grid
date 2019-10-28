<?php


namespace Palasthotel\Grid\WordPress;


/**
 * @property Plugin $plugin
 * @property \wpdb wpdb
 */
class Copy {

	const AJAX_ACTION_COPY = "copy_grid";
	const AJAX_PARAM_POST_ID = "postid";

	/**
	 * Copy constructor.
	 *
	 * @param Plugin $plugin
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;

		global $wpdb;
		$this->wpdb = $wpdb;

		add_filter( 'post_row_actions', array( $this, 'grid_wp_actions' ), 5, 2 );
		add_filter( 'page_row_actions', array( $this, 'grid_wp_actions' ), 5, 2 );

		add_action( 'wp_ajax_'.self::AJAX_ACTION_COPY, array($this, 'ajax_copy_grid'));
		add_action( Plugin::ACTION_COPY_AFTER, array($this, 'after_copy'), 10 , 4);
	}

	/**
	 * @param int $post_id
	 *
	 * @return string
	 */
	function getCopyActionUrl($post_id){
		return add_query_arg(
			array(
				'action' => self::AJAX_ACTION_COPY,
				self::AJAX_PARAM_POST_ID => $post_id
			),
			admin_url( 'admin-ajax.php' )
		);
	}

	/**
	 * add the grid action to post types
	 *
	 * @param array $actions
	 * @param \WP_Post $entity
	 *
	 * @return array
	 */
	function grid_wp_actions( $actions, $entity ) {
		if (
			true == get_option( 'grid_' . get_post_type() . '_enabled', false )
			&&
			$this->plugin->post->post_has_grid($entity->ID)
		) {
			$temp              = array();
			$temp['copy-grid'] = sprintf(
				'<a href="%s">%s</a>',
				$this->getCopyActionUrl($entity->ID),
				__( 'Copy Grid', Plugin::DOMAIN )
			);
			$actions           = array_merge( $temp, $actions );
		}

		return $actions;
	}

	/**
	 * copies post with grid to a new post with clone of the grid
	 */
	function ajax_copy_grid(){

		if(!current_user_can("edit_pages")) wp_die(__("You have no permission to copy a grid.", Plugin::DOMAIN));

		$post_id = intval($_GET[self::AJAX_PARAM_POST_ID]);

		if(!current_user_can("edit_page", $post_id)) wp_die(__("You have no permission to copy this grid.", Plugin::DOMAIN));
		if(!$this->plugin->post->post_has_grid($post_id)) wp_die(__("This post has no grid to copy.", Plugin::DOMAIN));

		$grid_id = $this->plugin->get_grid_by_postid($post_id);

		if(false === $grid_id) wp_die(__("Could not find grid.", Plugin::DOMAIN));

		// action just right before starting to copy data
		do_action(Plugin::ACTION_COPY_BEFORE, $post_id, $grid_id);

		// clone the grid
		$clone = $this->plugin->get_storage()->cloneGridById($grid_id);

		// clone post
		$title   = get_the_title($post_id).__(" - Copy", Plugin::DOMAIN);
		$source = get_post($post_id);
		$post    = array(
			'post_title' => $title,
			'post_status' => 'draft',
			'post_type' => $source->post_type,
		);

		$new_post_id = wp_insert_post($post);

		// connect post and grid
		$this->plugin->storageHelper->setPostGrid($new_post_id, $clone->gridid);

		// is there more to copy? do it!
		do_action(Plugin::ACTION_COPY_AFTER, $new_post_id, $clone, $post_id, $grid_id);

		// redirect to brand new grid copy
		$url = $this->plugin->theGrid->getEditorUrl($new_post_id);
		wp_redirect($url );
		exit;
	}

	/**
	 * @param int $new_post_id
	 * @param \stdClass $grid
	 * @param int $source_post_id
	 * @param int $source_grid_id
	 */
	public function after_copy($new_post_id, $grid, $source_post_id, $source_grid_id){

		// post format
		$format = get_post_format($source_post_id);
		set_post_format($new_post_id, $format);

		// Copy post metadata
		//		$data = get_post_custom($post_id);
		//		foreach ( $data as $key => $values) {
		//			foreach ($values as $value) {
		//				add_post_meta( $new_post_id, $key, $value );
		//			}
		//		}
	}
}