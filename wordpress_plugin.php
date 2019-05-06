<?php
/**
 * Plugin Name: Grid
 * Plugin URI: https://github.com/palasthotel/grid-wordpress
 * Description: Helps layouting pages with containerist.
 * Version: 1.8.2
 * Author: Palasthotel <rezeption@palasthotel.de> (in person: Benjamin Birkenhake, Edward Bock, Enno Welbers, Jana Marie Eggebrecht)
 * Author URI: http://www.palasthotel.de
 * Requires at least: 4.0
 * Tested up to: 5.2
 * License: http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 *
 * @copyright Copyright (c) 2014, Palasthotel
 * @package Palasthotel\Grid-WordPress
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @property string dir
 * @property string url
 */
class grid_plugin {

	const DOMAIN = "grid";

	const FILTER_POST_BOX_META_SEARCH = "grid_post_box_meta_search_results";
	
	/**
	 * construct grid plugin
	 */
	function __construct() {
		/**
		 * base paths
		 */
		$this->dir = plugin_dir_path( __FILE__ );
		$this->url = plugin_dir_url( __FILE__ );

		/**
		 * load constants
		 */
		require_once dirname( __FILE__ ) . '/constants/position_in_post.php';


		/**
		 * load translations
		 */
		load_plugin_textdomain( self::DOMAIN, false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

		global $grid_loaded;
		$grid_loaded = false;

		/**
		 * do stuff for wordpress spezific boxes
		 */
		require_once dirname( __FILE__ ) . '/classes/boxes.inc';
		new \grid_plugin\boxes();

		/**
		 * the grid itself!
		 */
		require_once dirname( __FILE__ ) . '/classes/the_grid.inc';
		new \grid_plugin\the_grid();

		/**
		 * Styles
		 */
		require_once dirname( __FILE__ ) . '/classes/post.inc';
		$this->post = new \grid_plugin\post();

		/**
		 * meta boxes
		 */
		require_once dirname( __FILE__ ) . '/classes/meta_boxes.inc';
		new \grid_plugin\meta_boxes( $this );

		/**
		 * wp ajax endpoint
		 */
		$this->get_ajax_endpoint();

		/**
		 *  Grid settings pages
		 */
		require_once dirname( __FILE__ ) . '/classes/settings.inc';
		new \grid_plugin\settings();

		/**
		 *  gird container factory
		 */
		require_once dirname( __FILE__ ) . '/classes/container_factory.inc';
		new \grid_plugin\container_factory();

		/**
		 *  gird container reuse
		 */
		require_once dirname( __FILE__ ) . '/classes/reuse_container.inc';
		new \grid_plugin\reuse_container();

		/**
		 *  gird box reuse
		 */
		require_once dirname( __FILE__ ) . '/classes/reuse_box.inc';
		new \grid_plugin\reuse_box();

		/**
		 *  gird privileges
		 */
		require_once dirname( __FILE__ ) . '/classes/privileges.inc';
		new \grid_plugin\privileges();

		/**
		 * Styles
		 */
		require_once dirname( __FILE__ ) . '/classes/styles.inc';
		new \grid_plugin\styles();

		add_action( 'wp_enqueue_scripts', array( $this, 'wp_head' ) );

		add_action( 'init', array( $this, 'init' ) );


		add_action( 'admin_head-options-reading.php', 'grid_modify_front_pages_dropdown' );
		add_action( 'pre_get_posts', 'grid_enable_front_page_landing_page' );

		register_uninstall_hook( __FILE__, 'grid_wp_uninstall' );
	}

	/**
	 * init grid to post types
	 */
	function init() {

		$options = get_option( 'grid', array() );
		if ( isset( $options['installed'] ) ) {
			global $grid_plugin;
			$grid_plugin->update();
		}

		do_action( 'grid_register_post_type' );
		// TODO register grid post types if enabled
		if ( get_option( "grid_landing_page_enabled", false ) ) {
			$permalink = get_option( 'grid_permalinks', '' );
			if ( '' == $permalink ) {
				$landing_page_permalink = _x( 'landing_page', 'slug', self::DOMAIN);
			} else {
				$landing_page_permalink = $permalink;
			}

			register_post_type( 'landing_page',
				apply_filters( 'grid_register_post_type_landing_page',
					array(
						'labels'            => array(
							'name'          => __( 'Landing Pages', self::DOMAIN ),
							'singular_name' => __( 'Landing Page', self::DOMAIN ),
							// labels to be continued
						),
						'menu_icon'         => plugins_url( 'images/post-type-icon.png', __FILE__ ),
						'description'       => __( 'This is where you can add new landing pages to your site.', self::DOMAIN ),
						'public'            => true,
						'show_ui'           => true,
						'hierarchical'      => false,
						// Hierarchical causes memory issues - WP loads all records!
						'rewrite'           => $landing_page_permalink ? array(
							'slug'       => untrailingslashit( $landing_page_permalink ),
							'with_front' => false,
							'feeds'      => true,
						)
							: false,
						'supports'          => array(
							'title',
							'custom-fields',
							'thumbnail',
							'excerpt',
							'comments',
							'revisions',
							'page-attributes',
						),
						'show_in_nav_menus' => true,
						'show_in_menu'      => 'grid_settings',
					)
				)
			);
		}
		// TODO enable sidebar post type if enabled
		if ( get_option( "grid_sidebar_enabled", false ) ) {

			register_post_type( 'sidebar',
				apply_filters( 'grid_register_post_type_landing_page',
					array(
						'labels'            => array(
							'name'          => __( 'Sidebars', self::DOMAIN ),
							'singular_name' => __( 'Sidebar', self::DOMAIN ),
							// labels to be continued
						),
						'menu_icon'         => plugins_url( 'images/post-type-icon.png', __FILE__ ),
						'description'       => __( 'This is where you can add new sidebars to your site.', self::DOMAIN ),
						'public'            => true,
						'show_ui'           => true,
						'hierarchical'      => false,
						// Hierarchical causes memory issues - WP loads all records!
						'show_in_nav_menus' => false,
						'show_in_menu'      => 'grid_settings',
					)
				)
			);
		}
	}

	/**
	 * loads grid manually
	 *
	 * @param $post
	 */
	function grid_load( $post ) {
		$this->post->grid_load( $post );
	}

	/**
	 * frontend grid css
	 */
	function wp_head() {
		if ( file_exists( get_stylesheet_directory() . '/grid/default-frontend.css' ) ) {
			// childtheme
			wp_enqueue_style( 'grid_frontend', get_stylesheet_directory_uri() . '/grid/default-frontend.css' );
		} else if ( file_exists( get_template_directory() . '/grid/default-frontend.css' ) ) {
			// parent theme
			wp_enqueue_style( 'grid_frontend', get_template_directory_uri() . '/grid/default-frontend.css' );
		} else {
			// default
			wp_enqueue_style( 'grid_frontend', admin_url( 'admin-ajax.php' ) . '?action=gridfrontendCSS' );
		}
	}

	/**
	 * register wp grid endpoint
	 */
	function get_ajax_endpoint() {
		/**
		 * grid ajax endpoint once
		 */
		require_once dirname(__FILE__). '/classes/ajaxendpoint.inc';

		return new \grid_plugin\ajaxendpoint();
	}

	/**
	 * returns postid of grid
	 *
	 * @param $gridid
	 *
	 * @return mixed
	 */
	function get_postid_by_grid( $gridid ) {
		global $wpdb;
		$rows = $wpdb->get_results( 'select nid from ' . $wpdb->prefix . 'grid_nodes where grid_id=' . $gridid );
		if ( count( $rows ) > 0 ) {
			return $rows[0]->nid;
		}

		return false;
	}

	/**
	 * return grid id of post
	 *
	 * @param $postid
	 *
	 * @return bool
	 */
	function get_grid_by_postid( $postid ) {
		global $wpdb;
		$rows = $wpdb->get_results( 'select grid_id from ' . $wpdb->prefix . "grid_nodes where nid=$postid" );
		if ( count( $rows ) > 0 ) {
			return $rows[0]->grid_id;
		}

		return false;
	}

	function fire_hook( $type, $subject, $value, $argument = NULL ) {
		if ( \Grid\Constants\Hook::TYPE_HOOK_ALTER == $type ) {
			return apply_filters( 'grid_' . $subject, $value, $argument );
		}
		do_action( 'grid_' . $subject, $value, $argument );
	}

	/**
	 * get grid storage
	 */
	function get_storage() {
		global $wpdb;
		global $grid_loaded;
		if ( ! $grid_loaded ) {
			do_action( 'grid_load_classes' );
			$grid_loaded = true;
		}
		global $grid_storage;
		if ( ! isset( $grid_storage ) ) {
			$user                           = wp_get_current_user();
			$storage                        = new grid_db( DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, $user->user_login, $wpdb->prefix, array(
				$this,
				'fire_hook',
			) );
			$storage->ajaxEndpoint          = new \grid_plugin\ajaxendpoint();
			$storage->ajaxEndpoint->storage = $storage;

			// for old versions
			$storage->templatesPath = get_stylesheet_directory() . '/grid/';

			$templatesPaths          = array();
			$templatesPaths[]        = get_stylesheet_directory() . '/grid/';
			$templatesPaths[]        = get_template_directory() . '/grid/';
			$templatesPaths          = apply_filters( 'grid_templates_paths', $templatesPaths );
			$templatesPaths[]        = dirname( __FILE__ ) . "/core/templates/wordpress";
			$storage->templatesPaths = $templatesPaths;

			$storage->containerstyle = get_option( 'grid_default_container_style', '__NONE__' );
			if ( '__NONE__' == $storage->containerstyle ) {
				$storage->containerstyle = NULL;
			}
			$storage->slotstyle = get_option( 'grid_default_slot_style', '__NONE__' );
			if ( '__NONE__' == $storage->slotstyle ) {
				$storage->slotstyle = NULL;
			}
			$storage->boxstyle = get_option( 'grid_default_box_style', '__NONE__' );
			if ( '__NONE__' == $storage->boxstyle ) {
				$storage->boxstyle = NULL;
			}
			$grid_storage = $storage;
		}

		return $grid_storage;
	}

	/**
	 * enqueue editor files
	 */
	function enqueue_editor_files( $editor = NULL ) {
		global $grid_lib;
		/**
		 * get editor or default
		 */
		$css = array();
		if ( NULL != $editor ) {
			$css = $editor->getCSS( false );
		} else {
			$css = $grid_lib->getEditorCSS( false );
		}
		/**
		 * enqueue the css array
		 */
		foreach ( $css as $idx => $file ) {
			wp_enqueue_style( 'grid_css_lib_' . $idx, plugins_url( 'lib/' . $file, __FILE__ ) );
		}
		wp_enqueue_style( 'grid_wordpress_css', plugins_url( 'css/grid-wordpress.css', __FILE__ ) );
		wp_enqueue_style( 'grid_wordpress_container_slots_css', add_query_arg( array(
			'noheader' => true,
			'page'     => 'grid_wp_container_slots_css',
		), admin_url( 'admin.php' ) ) );

		/**
		 * get editor or default
		 */
		$lang = grid_get_lang();
		$js   = array();
		if ( NULL != $editor ) {
			$js = $editor->getJS( $lang, false );
		} else {
			$js = $grid_lib->getEditorJS( $lang, false, false );
		}
		/**
		 * enqueue the js array
		 */
		foreach ( $js as $idx => $file ) {
			wp_enqueue_script( 'grid_js_lib_' . $idx, plugins_url( 'lib/' . $file, __FILE__ ) );
		}
		wp_enqueue_script( 'grid_wordpress_js', plugins_url( 'grid-wordpress.js', __FILE__ ) );

		/**
		 * get additional widgets arrays (css | js)
		 */
		$editor_widgets = grid_get_additional_editor_widgets();
		/**
		 * extend widgets css with editor css filter
		 */
		foreach ( $editor_widgets["css"] as $key => $url ) {
			wp_enqueue_style( 'grid_css_' . $key, $url );
		}
		/**
		 * extend widgets js
		 */
		foreach ( $editor_widgets["js"] as $key => $url ) {
			wp_enqueue_script( 'grid_js_' . $key, $url );
		}
	}

	/**
	 * update plugin
	 */
	function update() {
		global $grid_lib;
		global $grid_connection;

		$grid_connection = grid_wp_get_mysqli();

		$grid_lib->update();
		require_once dirname(__FILE__) . '/grid-wordpress-update.inc';
		$wp_update = new grid_wordpress_update();
		$wp_update->performUpdates();
		$grid_connection->close();
	}

	/**
	 * get language
	 */
	function get_lang() {
		if ( defined( 'WPLANG' ) ) {
			$lang = WPLANG;
		}
		if ( ! empty( $lang ) ) {
			return $lang;
		}

		return 'en';
	}

	/**
	 * get connection to database
	 *
	 * @return mysqli
	 */
	function get_db_connection() {
		$host = DB_HOST;
		$port = 3306;
		if ( strpos( DB_HOST, ':' ) !== false ) {
			$db_host = explode( ':', DB_HOST );
			$host    = $db_host[0];
			$port    = intval( $db_host[1] );
		}
		$connection = new mysqli( $host, DB_USER, DB_PASSWORD, DB_NAME, $port );
		if ( $connection->connect_errno ) {
			error_log( "WP Grid: " . $connection->connect_error, 4 );
			wp_die( "WP Grid could not connect to database." );
		}

		return $connection;
	}

}

/**
 * init grid library for global use
 */
require_once dirname( __FILE__ ) . '/lib/grid.php';
global $grid_lib;
$grid_lib = new grid_library();

/**
 * init grid
 */
global $grid_plugin;
$grid_plugin = new grid_plugin();

require_once dirname( __FILE__ ) . "/public-functions.php";
