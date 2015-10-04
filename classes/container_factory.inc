<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 12:42
 */

namespace grid_plugin;


class container_factory
{
	function __construct(){
		add_action( 'admin_menu', array($this, 'admin_menu') );
	}
	function admin_menu(){
		add_submenu_page( 'tools.php', 'grid containers', 'Grid Containers', 'edit_posts', 'grid_containers', array( $this, 'containers') );
	}
	function containers() {
		$storage = grid_wp_get_storage();
		global $grid_lib;
		$editor = $grid_lib->getContainerEditor();
		grid_enqueue_editor_files($editor);
		$html = $editor->run( $storage );
		echo $html;
	}
}