<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 21:02
 */

namespace Palasthotel\Grid\WordPress;


class ReuseBox extends _Component
{
	function onCreate(){
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}
	function admin_menu(){
		add_submenu_page( 'grid_settings', 'Reusable boxes', 'Reusable boxes', 'edit_posts', 'grid_reuse_boxes', array( $this, 'render_reuse_boxes' ) );
		add_submenu_page( null,'edit reuse box', 'edit reuse box', 'edit_posts', 'grid_edit_reuse_box', array( $this, 'edit_reuse_box' ) );
		add_submenu_page( null, 'delete reuse box', 'delete reuse box', 'edit_posts', 'grid_delete_reuse_box', array( $this, 'delete_reuse_box' ) );
	}

	function render_reuse_boxes() {
		$editor = $this->plugin->gridEditor->getReuseBoxEditor();
		grid_enqueue_editor_files($editor);
		$html = $editor->run( function( $id ) {
			return add_query_arg( array( 'page' => 'grid_edit_reuse_box', 'boxid' => $id ), admin_url( 'admin.php' ) );
		}, function( $id ) {
			return add_query_arg( array( 'noheader' => true, 'page' => 'grid_delete_reuse_box', 'boxid' => $id ), admin_url( 'admin.php' ) );
		});
		echo $html;
	}

	function edit_reuse_box() {
		$boxid = intval($_GET['boxid']);
		$editor = $this->plugin->gridEditor->getReuseBoxEditor();
		grid_enqueue_editor_files($editor);
		grid_wp_load_js();
		$html = $editor->runEditor(
			$boxid,
			add_query_arg( array( 'noheader' => true, 'page' => 'grid_ckeditor_config' ), admin_url( 'admin.php' ) ),
			add_query_arg( array( 'noheader' => true, 'page' => 'grid_ajax' ), admin_url( 'admin.php' ) ),
			get_option( 'grid_debug_mode', false ),
			''
		);
		echo $html;
	}

	function delete_reuse_box() {
		$boxid = intval($_GET['boxid']);
		global $grid_lib;
		$editor = $grid_lib->getReuseBoxEditor();
		grid_enqueue_editor_files($editor);
		$storage = grid_wp_get_storage();
		$html = $editor->runDelete( $storage, $boxid );
		if ( true === $html ) {
			wp_redirect( add_query_arg( array( 'page' => 'grid_reuse_boxes' ), admin_url( 'tools.php' ) ) );
			return;
		}
		echo $html;
	}
}