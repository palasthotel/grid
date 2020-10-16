<?php
/**
 * Plugin Name: Grid
 * Plugin URI: https://github.com/palasthotel/grid-wordpress
 * Description: Helps layouting pages with containerist.
 * Version: 2.0.3
 * Author: Palasthotel <rezeption@palasthotel.de> (in person: Benjamin Birkenhake, Edward Bock, Enno Welbers, Jana Marie Eggebrecht)
 * Author URI: http://www.palasthotel.de
 * Text Domain: grid
 * Domain Path: /languages
 *
 * Requires at least: 4.0
 * Tested up to: 5.5
 * License: http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 *
 * @copyright Copyright (c) 2019, Palasthotel
 * @package Palasthotel\Grid\WordPress
 */

namespace Palasthotel\Grid\WordPress;

// If this file is called directly, abort.
use Exception;
use Grid\Constants\GridCSSVariant;
use Grid\Constants\GridCssVariantFlexbox;
use Palasthotel\Grid\API;
use Palasthotel\Grid\Core;
use Palasthotel\Grid\ContainerEditor;
use Palasthotel\Grid\Editor;
use Palasthotel\Grid\Endpoint;
use Palasthotel\Grid\Storage;
use Palasthotel\Grid\Template;
use const Grid\Constants\GRID_CSS_VARIANT_NONE;
use const Grid\Constants\GRID_CSS_VARIANT_TABLE;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * @property string dir
 * @property string url
 * @property array grid_ids
 * @property array post_ids
 * @property StorageHelper storageHelper
 * @property TheGrid $theGrid
 * @property PositionInPost positionInPost
 * @property Post post
 * @property Ajax $gridAjax
 * @property API gridAPI
 * @property Editor gridEditor
 * @property Core gridCore
 * @property GridHook gridHook
 * @property GridQuery gridQuery
 * @property Boxes boxes
 * @property MetaBoxes metaBox
 * @property Settings settings
 * @property Template gridTemplate
 */
class Plugin {

	// ------------------------------------
	// constants
	// ------------------------------------
	const DOMAIN = "grid";

	// ------------------------------------
	// filters
	// ------------------------------------
	const FILTER_POST_BOX_META_SEARCH = "grid_post_box_meta_search_results";

	// ------------------------------------
	// actions
	// ------------------------------------
	const ACTION_COPY_BEFORE = "grid_copy_before";
	const ACTION_COPY_AFTER = "grid_copy_after";
	const ACTION_LOAD_CLASSES = "grid_load_classes";

	// ------------------------------------
	// options
	// ------------------------------------
	const OPTION_FRONTEND_CSS_VARIANT = "grid_frontend_css_variant";

	
	/**
	 * construct grid plugin
	 */
	function __construct() {

		/**
		 * base paths
		 */
		$this->dir = plugin_dir_path( __FILE__ );
		$this->url = plugin_dir_url( __FILE__ );

		// ------------------------------------
		// autoloader
		// ------------------------------------
		require_once dirname(__FILE__). "/lib/grid/vendor/autoload.php";
		require_once dirname( __FILE__ ) . "/vendor/autoload.php";

		// ------------------------------------
		// cache properties
		// ------------------------------------
		$this->grid_ids = array();
		$this->post_ids = array();

		/**
		 * load translations
		 */
		load_plugin_textdomain(
			Plugin::DOMAIN,
			false,
			dirname( plugin_basename( __FILE__ ) ) . '/languages'
		);

		global $grid_loaded;
		$grid_loaded = false;

		// ------------------------------------
		// construct component classes
		// ------------------------------------

		$this->gridQuery = new GridQuery();
		$this->gridHook = new GridHook();
		// TODO: maybe move to later action for author name
		$this->gridCore     = new Core($this->gridQuery, $this->gridHook, "");
		$this->gridTemplate = new Template();
		$this->gridAjax     = new Ajax();
		$this->gridAPI      = new API($this->gridCore, $this->gridAjax, $this->gridTemplate);
		$this->gridEditor   = new Editor($this->gridCore->storage);

		/**
		 * wrapper for grid library storage
		 */
		$this->storageHelper = new StorageHelper($this);

		/**
		 * do stuff for wordpress spezific boxes
		 */
		$this->boxes = new Boxes($this);

		/**
		 * the grid itself!
		 */
		$this->theGrid = new TheGrid($this);

		/**
		 * Styles
		 */
		$this->post = new Post($this);

		/**
		 * meta boxes
		 */
		$this->metaBox = new MetaBoxes( $this );

		/**
		 *  Grid settings pages
		 */
		$this->settings = new Settings($this);

		/**
		 *  gird container factory
		 */
		new ContainerFactory($this);

		/**
		 *  gird container reuse
		 */
		new ReuseContainer($this);

		/**
		 *  gird box reuse
		 */
		new ReuseBox($this);

		/**
		 *  gird privileges
		 */
		new Privileges($this);

		/**
		 * Styles
		 */
		new Styles($this);

		/**
		 * copy grids
		 */
		new Copy($this);

		// ------------------------------------------------------
		// other stuff that should better be refactored
		// ------------------------------------------------------
		add_action( 'wp_enqueue_scripts', array( $this, 'wp_head' ) );

		add_action( 'init', array( $this, 'init' ) );

		add_action( 'admin_head-options-reading.php', 'grid_modify_front_pages_dropdown' );
		add_action( 'pre_get_posts', 'grid_enable_front_page_landing_page' );

		// ------------------------------------
		// activate, deactivate and uninstall
		// ------------------------------------
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_uninstall_hook( __FILE__, array( __CLASS__, 'uninstall' ) );
	}

	/**
	 * init grid to post types
	 */
	function init() {

		$options = get_option( 'grid', array() );
		if ( isset( $options['installed'] ) ) {
			$this->update();
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
							'name'          => __( 'Landing Pages', Plugin::DOMAIN ),
							'singular_name' => __( 'Landing Page', Plugin::DOMAIN ),
							// labels to be continued
						),
						'menu_icon'         => plugins_url( 'images/post-type-icon.png', __FILE__ ),
						'description'       => __( 'This is where you can add new landing pages to your site.', Plugin::DOMAIN ),
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

		do_action(self::ACTION_LOAD_CLASSES);
		$storage = $this->gridCore->storage;
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

		$user = wp_get_current_user();
		$storage->author = $user->user_login;

		$templatesPaths          = array();
		$templatesPaths[]        = get_stylesheet_directory() . '/grid/';
		$templatesPaths[]        = get_template_directory() . '/grid/';
		$templatesPaths          = apply_filters( 'grid_templates_paths', $templatesPaths );
		$templatesPaths[]        = dirname( __FILE__ ) . "/core/templates/wordpress";

		foreach ($templatesPaths as $path){
			$this->gridTemplate->addTemplatesPath($path);
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
			$css = GridCSSVariant::getVariant(GRID_CSS_VARIANT_TABLE);
			$variant = get_option(Plugin::OPTION_FRONTEND_CSS_VARIANT, $css->slug());
			if($variant != GRID_CSS_VARIANT_NONE){
				wp_enqueue_style(
					'grid_frontend',
					admin_url( 'admin-ajax.php' ) . '?action=gridfrontendCSS&variant='.$variant
				);
			}
		}
	}

	/**
	 * returns postid of grid
	 *
	 * @param int $gridid
	 *
	 * @param bool $force_reload
	 *
	 * @return mixed
	 */
	function get_postid_by_grid( $gridid, $force_reload = false ) {
		global $wpdb;
		if(!$force_reload && isset($this->post_ids[$gridid])) return $this->post_ids[$gridid];
		$rows = $wpdb->get_results( 'select nid from ' . $wpdb->prefix . 'grid_nodes where grid_id=' . $gridid );
		if ( count( $rows ) > 0 ) {
			$this->post_ids[$gridid] =  $rows[0]->nid;
			return $this->post_ids[$gridid];
		}

		return false;
	}

	/**
	 * return grid id of post
	 *
	 * @param int $postid
	 *
	 * @param bool $force_reload
	 *
	 * @return bool
	 */
	function get_grid_by_postid( $postid, $force_reload = false ) {
		global $wpdb;
		if(!$force_reload && isset($this->grid_ids[$postid])) return $this->grid_ids[$postid];
		$rows = $wpdb->get_results( 'select grid_id from ' . $wpdb->prefix . "grid_nodes where nid=$postid" );
		if ( count( $rows ) > 0 ) {
			$this->grid_ids[$postid] = $rows[0]->grid_id;
			return $this->grid_ids[$postid];
		}

		return false;
	}

	/**
	 * enqueue editor files
	 *
	 * @param null|ContainerEditor $editor
	 */
	function enqueue_editor_files( $editor = NULL ) {
		/**
		 * get editor or default
		 */
		$css = array();
		if ( NULL != $editor ) {
			$css = $editor->getCSS();
		} else {
			$css = $this->gridEditor->getEditorCSS();
		}
		/**
		 * enqueue the css array
		 */
		foreach ( $css as $idx => $file ) {
			wp_enqueue_style( 'grid_css_lib_' . $idx, plugins_url( 'lib/grid/' . $file, __FILE__ ) );
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
			$js = $editor->getJS( false );
		} else {
			$js = $this->gridEditor->getEditorJS( $lang, false, false );
		}
		/**
		 * enqueue the js array
		 */
		foreach ( $js as $idx => $file ) {
			wp_enqueue_script(
				"grid_js_lib_$idx",
				plugins_url( "lib/grid/$file", __FILE__ ),
				[],
				filemtime(plugin_dir_path(__FILE__)."/lib/grid/$file")
			);
		}
		wp_enqueue_script(
			"grid_wordpress_js",
			plugins_url( 'grid-wordpress.js', __FILE__ ),
			["jquery", "jquery-ui-draggable", "jquery-ui-sortable", "jquery-ui-droppable", 'media-upload'],
			filemtime(plugin_dir_path(__FILE__)."/grid-wordpress.js")
		);

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
	 * on plugin activation
	 */
	function activate(){
		$options = get_option( 'grid', array() );
		if ( ! isset( $options['installed'] ) ) {
			$schema = $this->gridAPI->getDatabaseSchema();
			$schema['grid_nodes'] = array(
				'description' => t( 'references nodes' ),
				'fields' => array(
					'nid' => array(
						'description' => t( 'node id' ),
						'type' => 'int',
						'unsigned' => true,
						'not null' => true,
					),
					'grid_id' => array(
						'description' => t( 'grid id' ),
						'type' => 'int',
						'size' => 'normal',
						'unsigned' => true,
						'not null' => true,
					),
				),
				'primary key' => array( 'nid' ),
				'mysql_engine' => 'InnoDB',
			);

			foreach ( $schema as $tablename => $data ) {
				$query = "create table if not exists {".$tablename."} (";
				$first = true;
				foreach ( $data['fields'] as $fieldname => $fielddata ) {
					if ( ! $first ) {
						$query .= ',';
					} else {
						$first = false;
					}
					$query .= "$fieldname ";
					if ( 'int' == $fielddata['type'] ) {
						$query .= 'int ';
					} elseif ( 'text' == $fielddata['type'] ) {
						$query .= 'text ';
						if(isset($data['collate'])){
							$query .= ' COLLATE '.$data['collate'];
						}
					} elseif ( 'serial' == $fielddata['type'] ) {
						$query .= 'int ';
					} elseif ( 'varchar' == $fielddata['type'] ) {
						$query .= 'varchar('.$fielddata['length'].') ';
						if(isset($data['collate'])){
							$query .= ' COLLATE '.$data['collate'];
						}
					} else {
						die( 'unknown type '.$fielddata['type'] );
					}
					if ( isset( $fielddata['unsigned'] ) && $fielddata['unsigned'] ) {
						$query .= ' unsigned';
					}
					if ( isset($fielddata['not null']) && $fielddata['not null'] ) {
						$query .= ' not null';
					}
					if ( 'serial' == $fielddata['type'] ) {
						$query .= ' auto_increment';
					}

				}
				if ( isset( $data['primary key'] ) ) {
					$query .= ',constraint primary key ('.implode( ',', $data['primary key'] ).')';
				}
				if( isset($data["unique keys"]) && is_array($data["unique keys"])){
					foreach($data["unique keys"] as $key_name => $key_columns){
						$query .= ', UNIQUE KEY '.$key_name.' ('.implode(', ', $key_columns).')';
					}
				}
				if( isset($data["indexes"]) && is_array($data["indexes"])){
					foreach($data["indexes"] as $key_name => $key_columns){
						$query .= ', INDEX '.$key_name.' ('.implode(', ', $key_columns).')';
					}
				}
				$query .= ') ';
				if ( isset( $data['mysql_engine'] ) ) {
					$query .= 'ENGINE = '.$data['mysql_engine'];
				}
				if ( isset( $data['mysql_character_set'] ) ) {
					$query .= ' CHARSET '.$data['mysql_character_set'];
				}
				if( isset($data['collate'])){
					$query.= ' COLLATE='.$data['collate'];
				}
				try{
					$result = $this->gridQuery->execute( $query );
					if($result === false){
						throw new Exception($query.' failed: '.$grid_connection->error );
					}
				} catch (Exception $e){
					error_log($e->getMessage(), 4);
					wp_die("Error with grid db_query");
				}


			}

			$this->gridAPI->install();
			$update = new Update($this->gridQuery);
			$update->install();

			$options['installed'] = true;
			update_option( 'grid', $options );

			/**
			 * default post types for grids
			 */
			update_option( 'grid_landing_page_enabled', true );

			/**
			 * default searchable post types in grid
			 */
			update_option( 'grid_post_search_enabled', true );
			update_option( 'grid_page_search_enabled', true );
			/**
			 * othter defaults
			 */
			update_option( 'grid_default_container', 'c-1d1' );
		}
		// for initial content type registration
		$this->init();
		flush_rewrite_rules();
	}

	/**
	 * update plugin
	 */
	function update() {
		$this->gridCore->update();
		$wp_update = new Update($this->gridQuery);
		$wp_update->performUpdates();
	}

	/**
	 * uninstall plugin
	 */
	static function uninstall()
	{
		if(is_multisite())
		{
			global $wpdb;
			$blogids=$wpdb->get_col("SELECT blog_id FROM {$wpdb->blogs}");
			foreach($blogids as $blog_id)
			{
				switch_to_blog($blog_id);
				$grid=get_option('grid',array());
				if(isset($grid['installed']))
				{
					self::perform_uninstall();
				}
			}
		}
		else
		{
			self::perform_uninstall();
		}
	}

	/**
	 * plugin deleted by admin interface do this
	 */
	private static function perform_uninstall()
	{
		$posts=get_posts(array('post_type'=>'landing_page','posts_per_page'=>-1));
		foreach($posts as $post) {
			wp_delete_post($post->ID);
		}

		delete_option('grid');
		delete_option('grid_landing_page_enabled');
		delete_option('grid_default_container');
		$schema = self::instance()->api->getDatabaseSchema();
		$schema['grid_nodes']=array();
		self::instance()->api->uninstall();
		foreach($schema as $tablename=>$data)
		{
			$query = "drop table {$tablename}";
			self::instance()->gridQuery->execute( $query );
		}
	}

	/**
	 * get language
	 */
	function get_lang()
	{
		if ( defined( 'WPLANG' ) ) {
			$lang = WPLANG;
		}
		if ( ! empty( $lang ) ) {
			return $lang;
		}

		return 'en';
	}

	/**
	 * @var null|Plugin $instance
	 */
	private static $instance;

	/**
	 * @return Plugin
	 */
	public static function instance(){
		if(self::$instance == null) self::$instance = new Plugin();
		return self::$instance;
	}

}

// ----------------------------
// init grid plugin and library
// ----------------------------
/**
 * init grid
 */
Plugin::instance();

// ----------------------------
// public usable functions
// ----------------------------
require_once dirname( __FILE__ ) . "/public-functions.php";

// ----------------------------
// deprecation wrappers
// ----------------------------
require_once dirname( __FILE__ ) . "/deprecated.php";
require_once dirname( __FILE__ ) . "/deprecated-namespace.php";
