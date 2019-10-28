<?php


namespace Palasthotel\Grid\WordPress;


/**
 * @property Plugin $plugin
 */
class Copy {

	/**
	 * Copy constructor.
	 *
	 * @param Plugin $plugin
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		add_filter( 'post_row_actions', array( $this, 'grid_wp_actions' ), 5, 2 );
		add_filter( 'page_row_actions', array( $this, 'grid_wp_actions' ), 5, 2 );
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
			$copyGridUrl       = "#";
			$temp['copy-grid'] = sprintf( '<a href="%s">%s</a>', $copyGridUrl, __( 'Copy Grid', Plugin::DOMAIN ) );
			$actions           = array_merge( $temp, $actions );
		}

		return $actions;
	}
}