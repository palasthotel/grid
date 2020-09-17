<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 12:42
 */

namespace Palasthotel\Grid\WordPress;


class ContainerFactory extends _Component
{
	function onCreate(){
		add_action( 'admin_menu', array($this, 'admin_menu') );
	}
	function admin_menu(){
		add_submenu_page( 'grid_settings', 'Container types', 'Container types', 'edit_posts', 'grid_containers', array( $this, 'containers') );
	}
	function containers() {
		$storage = grid_wp_get_storage();
		global $grid_lib;
		$editor = $this->plugin->gridEditor->getContainerEditor();
		grid_enqueue_editor_files($editor);
		$html = $editor->run( $storage );
		echo $html;
	}
}