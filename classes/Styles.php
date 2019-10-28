<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 12:52
 */

namespace Palasthotel\Grid\WordPress;


class Styles
{
	function __construct(){
		add_action( 'admin_menu', array($this, 'admin_menu') );
	}

	function admin_menu(){
		add_submenu_page(
			'grid_settings',
			'grid styles',
			'Styles',
			'edit_posts',
			'grid_styles',
			array( $this, 'styles')
		);
	}

	function styles() {
		global $grid_connection;
		$grid_connection = grid_wp_get_mysqli();
		$storage = grid_wp_get_storage();
		global $grid_lib;
		$editor = $grid_lib->getStyleEditor();
		$html = $editor->run( $storage );
		echo $html;
		$grid_connection->close();
	}

}