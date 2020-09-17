<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 12:52
 */

namespace Palasthotel\Grid\WordPress;


class Styles extends _Component
{
	function onCreate(){
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
		$editor = $this->plugin->gridEditor->getStyleEditor();
		$html = $editor->run();
		echo $html;
	}

}