<?php


namespace Palasthotel\Grid\WordPress;


/**
 * @property Plugin plugin
 */
class _Component {
	/**
	 * _Component constructor.
	 *
	 * @param Plugin $plugin
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		$this->onCreate();
	}

	/**
	 * overwrite this method in component implementations
	 */
	public function onCreate() {

	}
}