<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 19:58
 */

namespace grid_plugin;


class the_grid
{
	function __construct(){
		add_action( 'admin_menu', array( $this, 'admin_menu') );

		add_action( 'wp_ajax_gridfrontendCSS', array($this, 'container_slots_css') );
		add_action( 'wp_ajax_nopriv_gridfrontendCSS', array( $this, 'container_slots_css' ) );

		add_filter( 'post_row_actions', array( $this, 'grid_wp_actions' ), 10, 2 );
		add_filter( 'page_row_actions', array( $this, 'grid_wp_actions' ), 10, 2 );
	}

	/**
	 * add the grid action to post types
	 * @param $actions
	 * @param $entity
	 * @return array
	 */
	function grid_wp_actions( $actions, $entity ) {
		if ( true == get_option( 'grid_'.get_post_type().'_enabled', false ) ) {
			$temp = array();
			$temp['grid'] = '<a href="'.add_query_arg( array( 'page' => 'grid', 'postid' => $entity->ID ), admin_url( 'admin.php' ) ).'">'.__('Edit Grid', 'grid').'</a>';
			$actions = array_merge( $temp, $actions );
		}
		return $actions;
	}

	function admin_menu(){
		add_submenu_page( null, 'The Grid', 'The Grid', 'edit_posts', 'grid', array( $this, 'render_grid' ) );
		add_submenu_page( null, 'Grid AJAX', 'The Grid AJAX', 'edit_posts', 'grid_ajax', array( $this, 'ajax' ) );
		add_submenu_page( null, 'Grid CKEditor Config', 'Grid CKEditor Config', 'edit_posts', 'grid_ckeditor_config', array( $this, 'ckeditor_config' ) );
		add_submenu_page( null, 'Grid Container slots CSS', 'Grid Conatiner slots CSS', 'edit_posts', 'grid_wp_container_slots_css', array( $this, 'container_slots_css' ) );
	}

	function render_grid() {
		global $wpdb;
		//	$storage=grid_wp_get_storage();
		$postid = intval($_GET['postid']);
		
		/**
		 * if there is no post id. we cannot do anytihng
		 */
		if( 0=== $postid ){
			?>
			<p><?php _e('Ups! I cannot find a Grid without an Post ID.', 'grid'); ?></p>
			<?php
			return;
		}
		
		/**
		 * look for grid id
		 */
		$rows = $wpdb->get_results( 'select grid_id from '.$wpdb->prefix."grid_nodes where nid=$postid" );
		
		if ( 0 == count( $rows ) ) {
			$storage = grid_wp_get_storage();
			$id = $storage->createGrid();
			$grid = $storage->loadGrid( $id );
			$post = get_post( $postid );
			if ( $post->post_type == get_option( 'grid_sidebar_post_type' ) ) {
				$grid->insertContainer( 'sc-1d3', 0 );
			} else if ( '__NONE__' != get_option( 'grid_default_container', '__NONE__' ) ) {
				$grid->insertContainer( get_option( 'grid_default_container' ), 0 );
			}
			$wpdb->query( 'insert into '.$wpdb->prefix."grid_nodes (nid,grid_id) values ($postid,$id)" );
			$grid_id = $id;
		} else{
			$grid_id = $rows[0]->grid_id;
		}
		
		global $grid_lib;
		

		$post = get_post( $postid );

		grid_enqueue_editor_files();

		echo '<div class="wrap"><h2>'.$post->post_title.
			' <a title="Return to the post-edit page" class="add-new-h2"'.
			' href="'.admin_url("post.php?post=$postid&action=edit").'" >'.__('Edit Post').'</a'.
			'><a class="add-new-h2" href="'.
			get_permalink( $postid ).'">'.__('View Post').'</a></h2> </div>';

		/**
		 * async parameters
		 */
		$async_service='';
		$async_domain='';
		$async_author='';
		$async_path='';
		$async_timeout = 60*5;
		if(get_option('grid_async',true))
		{
			/** @var \WP_User $user */
			$user=wp_get_current_user();
			$async_service = get_option("grid_async_url",'');
			if(''==$async_service)
			{
				$secure = "";
				if(isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) == 'on'){
					$secure = "s";
				}
				$async_service = "http".$secure."://async.the-grid.ws";
			}
			$async_domain= get_home_url();
			$async_author= (!empty($user->display_name))? $user->display_name : $user->user_login;
			$async_path="grid-post-id-".$postid;

			$async_timeout = get_option("grid_async_timeout",5*60);
		}


		$html = $grid_lib->getEditorHTML(
			$grid_id,
			'grid',
			add_query_arg( array( 'noheader' => true, 'page' => 'grid_ckeditor_config' ), admin_url( 'admin.php' ) ),
			add_query_arg( array( 'noheader' => true, 'page' => 'grid_ajax' ), admin_url( 'admin.php' ) ),
			get_option( 'grid_debug_mode', false ),
			add_query_arg( array( 'grid_preview' => true ), get_permalink( $postid ) ),
			add_query_arg( array( 'grid_preview' => true, 'grid_revision' => '{REV}' ), get_permalink( $postid ) ),
			$async_service,
			$async_domain,
			$async_author,
			$async_path,
		    $async_timeout
		);


		grid_wp_load_js();

		echo $html;
	}

	function ckeditor_config() {
		$styles = array();
		$formats = array();
		$ckeditor_plugins = array();

		$styles = apply_filters( 'grid_styles', $styles );
		$formats = apply_filters( 'grid_formats', $formats );
		$ckeditor_plugins = apply_filters('grid_ckeditor_plugins', $ckeditor_plugins);

		global $grid_lib;
		echo $grid_lib->getCKEditorConfig( $styles, $formats, $ckeditor_plugins );
		die();
	}

	function container_slots_css() {
		global $grid_lib;
		global $wpdb;
		$rows = $wpdb->get_results( 'select * from '.$wpdb->prefix.'grid_container_type' );
		echo $grid_lib->getContainerSlotCSS( $rows );
		die();
	}

	function ajax() {
		$storage = grid_wp_get_storage();
		$storage->handleAjaxCall();
		die();
	}
}
