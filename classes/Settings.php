<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 12:09
 */

namespace Palasthotel\Grid\WordPress;


class Settings
{
	function __construct(){
		add_action( 'admin_bar_menu', array( $this, 'admin_bar' ), 999 );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'admin_init', array( $this, 'admin_init' ) );


	}

	/**
	 * add adminbar button
	 */
	function admin_bar() {
		/**
		 * @var \WP_Admin_Bar $wp_admin_bar
		 */
		global $wp_admin_bar;
		global $post;
		if ( isset( $post->grid ) || (is_admin() && isset($post->ID) && grid_wp_get_grid_by_postid($post->ID)  )) {
			$wp_admin_bar->add_node( array(
				'id' => 'grid_wp_thegrid',
				'title' => __('Edit Grid', Plugin::DOMAIN),
				'href' => add_query_arg( array( 'page' => 'grid', 'postid' => $post->ID ), admin_url( 'admin.php' ) ),
			) );
		}
	}

	/**
	 * register admin menu page for settings
	 */
	function admin_menu(){
		add_menu_page(
				'Grid',
				'Grid',
				"manage_options",
				'grid_settings',
				null,
				plugins_url( '../images/post-type-icon.png', __FILE__),
				35
		);
		add_submenu_page( 'grid_settings', 'Settings', 'Settings', 'manage_options', 'grid_settings', array( $this, 'render_settings_form' ) );
	}

	/**
	 * render settings form
	 */
	function render_settings_form() {
		?>
		<div class="wrap">
			<h2><?php _e('Grid Settings', Plugin::DOMAIN); ?></h2>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'grid_settings' );
				do_settings_sections( 'grid_settings' );
				?>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 *
	 */
	function admin_init() {
		/**
		 * default styles
		 */
		add_settings_section( 'grid_default_styles', __('Default Styles', Plugin::DOMAIN), array( $this, 'default_styles_settings_section' ), 'grid_settings' );
		add_settings_field( 'grid_default_container_style', __('Container Style', Plugin::DOMAIN), array( $this, 'default_container_style_html' ), 'grid_settings', 'grid_default_styles' );
		register_setting( 'grid_settings', 'grid_default_container_style' );
		add_settings_field( 'grid_default_slot_style', __('Slot Style', Plugin::DOMAIN), array( $this, 'default_slot_style_html' ), 'grid_settings', 'grid_default_styles' );
		register_setting( 'grid_settings', 'grid_default_slot_style' );
		add_settings_field( 'grid_default_box_style', __('Box Style',Plugin::DOMAIN), array( $this, 'default_box_style_html' ), 'grid_settings', 'grid_default_styles' );
		register_setting( 'grid_settings', 'grid_default_box_style' );

		/**
		 * enabled post types for grid
		 */
		add_settings_section( 'grid_post_types', __('Post Types', Plugin::DOMAIN), array( $this, 'post_type_settings_section' ), 'grid_settings' );
		$post_types = get_post_types( array('public' => true, 'show_ui' => true), 'objects' );
		foreach ( $post_types as $key => $post_type ) {
			// ignore landing_page and sidebar because we check them seperately
			if($key == 'landing_page' || $key == "sidebar") continue;
			add_settings_field( 'grid_'.$key.'_enabled', $post_type->labels->name, array( $this, 'post_type_html' ), 'grid_settings', 'grid_post_types', array( 'type' => $key ) );
			register_setting( 'grid_settings', 'grid_'.$key.'_enabled' );
		}
		/**
		 * check manually because disabling this will unregister post types
		 */
		add_settings_field( 'grid_landing_page_enabled', __("Landing Pages", Plugin::DOMAIN), array( $this, 'post_type_html' ), 'grid_settings', 'grid_post_types', array( 'type' => 'landing_page') );
		register_setting( 'grid_settings', 'grid_landing_page_enabled' );
		add_settings_field( 'grid_sidebar_enabled', __("Sidebars", Plugin::DOMAIN), array( $this, 'post_type_html' ), 'grid_settings', 'grid_post_types', array( 'type' => 'sidebar') );
		register_setting( 'grid_settings', 'grid_sidebar_enabled' );

		/**
		 * post types for search
		 */
		add_settings_section( 'grid_post_types_search', __('Post Types for content search', Plugin::DOMAIN), array( $this, 'post_type_search_settings_section' ), 'grid_settings' );
		$post_types = get_post_types( array('public' => true, 'show_ui' => true), 'objects' );
		foreach ( $post_types as $key => $post_type ) {
			add_settings_field( 'grid_'.$key.'_search_enabled', $post_type->labels->name, array( $this, 'post_type_search_html' ), 'grid_settings', 'grid_post_types_search', array( 'type' => $key ) );
			register_setting( 'grid_settings', 'grid_'.$key.'_search_enabled' );
		}


		/**
		 * sidebar post type
		 */
		add_settings_field( 'grid_sidebar_post_type', __('Which post type to use as sidebar content', Plugin::DOMAIN), array( $this, 'sidebar_html' ), 'grid_settings', 'grid_post_types' );
		register_setting( 'grid_settings', 'grid_sidebar_post_type' );

		/**
		 * default grid container
		 */
		add_settings_section( 'grid_default_container', __('New Grids', Plugin::DOMAIN), array( $this, 'default_container_section' ), 'grid_settings' );
		add_settings_field( 'grid_default_container', __('Which container should be placed automatically', Plugin::DOMAIN), array( $this, 'default_container_html' ), 'grid_settings', 'grid_default_container' );
		register_setting( 'grid_settings', 'grid_default_container' );

		/**
		 * debug mode
		 */
		add_settings_section( 'grid_debug_mode', __('Debug Mode', Plugin::DOMAIN), array( $this, 'debug_mode_section' ), 'grid_settings' );
		add_settings_field( 'grid_debug_mode', __('Turn debug mode on/off', Plugin::DOMAIN), array( $this, 'debug_mode_html' ), 'grid_settings', 'grid_debug_mode' );
		register_setting( 'grid_settings', 'grid_debug_mode' );

		/**
		 * async settings
		 */
		add_settings_section( 'grid_async_service', __('Async', Plugin::DOMAIN), array( $this, 'async_section' ), 'grid_settings' );

		add_settings_field( 'grid_async', _x('Enable', 'grid_async', Plugin::DOMAIN), array( $this, 'async_enable_html' ), 'grid_settings', 'grid_async_service' );
		register_setting( 'grid_settings', 'grid_async' );

		add_settings_field( 'grid_async_url', __('Service url (leave empty to use default url)', Plugin::DOMAIN), array( $this, 'async_url_html' ), 'grid_settings', 'grid_async_service' );
		register_setting( 'grid_settings', 'grid_async_url' );

		add_settings_field( 'grid_async_timeout', __('After how many seconds an author loses the lock on a grid when not active?', Plugin::DOMAIN), array( $this, 'async_timeout_html' ), 'grid_settings', 'grid_async_service' );
		register_setting( 'grid_settings', 'grid_async_timeout' );

		/**
		 * mediaselect info
		 */
		add_settings_section( 'grid_mediaselect_info', __('Mediaselect Info', Plugin::DOMAIN), array( $this, 'mediaselect_info_section' ), 'grid_settings' );
		add_settings_field( 'grid_mediaselect_info', __('Set an info text for media in the WordPress media-box', Plugin::DOMAIN), array( $this, 'mediaselect_info_html' ), 'grid_settings', 'grid_mediaselect_info' );
		register_setting( 'grid_settings', 'grid_mediaselect_info' );

		/**
		* mediaselect types
		*/
		add_settings_section( 'grid_mediaselect_types', __('Mediaselect Types', Plugin::DOMAIN), array( $this, 'mediaselect_types_section' ), 'grid_settings' );
		add_settings_field( 'grid_mediaselect_types', __('Choose types for media-box', Plugin::DOMAIN), array( $this, 'mediaselect_types_html' ), 'grid_settings', 'grid_mediaselect_types' );
		register_setting( 'grid_settings', 'grid_mediaselect_types' );

		/**
		 * permalinks
		 */
		add_settings_section( 'grid_permalinks', __('Grid', Plugin::DOMAIN), array( $this, 'permalinks_section' ), 'grid_settings' );
		add_settings_field( 'grid_permalinks', __('Landing Page base', Plugin::DOMAIN), array( $this, 'permalinks_html' ), 'grid_settings', 'grid_permalinks' );
		register_setting( 'grid_settings', 'grid_permalinks' );
	}

	function default_styles_settings_section() {
		_e('Set which default styles should be applied.',Plugin::DOMAIN);
	}

	function default_container_style_html() {
		$storage = grid_wp_get_storage();
		$types = $storage->fetchContainerStyles();
		$setting = get_option( 'grid_default_container_style', '__NONE__' );
		?>
		<select id="grid_default_container_style" name="grid_default_container_style">
			<option value="__NONE__" <?php echo ( $setting == '__NONE__' ? 'selected' : '' ) ?>><?php _ex('None', 'grid_styles', Plugin::DOMAIN); ?></option>
			<?php
			foreach ( $types as $idx => $elem ) {
				?>
				<option value="<?php echo $elem['slug'];?>" <?php echo ( $elem['slug'] == $setting ? 'selected' : '' );?>><?php echo $elem['title'];?></option>
				<?php
			}
			?>
		</select>
		<?php
	}

	function default_slot_style_html() {
		$storage = grid_wp_get_storage();
		$types = $storage->fetchSlotStyles();
		$setting = get_option( 'grid_default_slot_style', '__NONE__' );
		?>
		<select id="grid_default_slot_style" name="grid_default_slot_style">
			<option value="__NONE__" <?php echo ( $setting == '__NONE__' ? 'selected' : '' );?>><?php _ex('None', 'grid_styles', Plugin::DOMAIN); ?></option>
			<?php
			foreach ( $types as $idx => $elem ) {
				?>
				<option value="<?php echo $elem['slug'];?>" <?php echo ( $elem['slug'] == $setting ? 'selected' : '' );?>><?php echo $elem['title'];?></option>
				<?php
			}
			?>
		</select>
		<?php
	}

	function default_box_style_html() {
		$storage = grid_wp_get_storage();
		$types = $storage->fetchBoxStyles();
		$setting = get_option( 'grid_default_box_style', '__NONE__' );
		?>
		<select id="grid_default_box_style" name="grid_default_box_style">
			<option value="__NONE__" <?php echo ( $setting == '__NONE__' ? 'selected' : '');?>><?php _ex('None', 'grid_styles', Plugin::DOMAIN); ?></option>
			<?php
			foreach ( $types as $idx => $elem ) {
				?>
				<option value="<?php echo $elem['slug'];?>" <?php echo ( $elem['slug'] == $setting ? 'selected' : '' );?>><?php echo $elem['title'];?></option>
				<?php
			}
			?>
		</select>
		<?php
	}

	function post_type_html( $args ) {
		$posttype = $args['type'];
		$value = get_option( 'grid_'.$posttype.'_enabled', false );
		?>
		<input type="checkbox" id="grid_<?php echo $posttype?>_enabled" name="grid_<?php echo $posttype?>_enabled" <?php echo ( $value ? 'checked' : '' )?>> <?php echo ($value ? "Enabled": "Disabled") ?>
		<?php
	}

	function post_type_settings_section() {
		echo __('Which post types should have grid support?', Plugin::DOMAIN);
	}

	function post_type_search_html( $args ) {
		$posttype = $args['type'];
		$value = get_option( 'grid_'.$posttype.'_search_enabled', false );
		?>
		<input type="checkbox" id="grid_<?php echo $posttype?>_search_enabled" name="grid_<?php echo $posttype?>_search_enabled" <?php echo ( $value ? 'checked' : '' )?>> <?php echo ($value ? "Enabled": "Disabled") ?>
		<?php
	}

	function post_type_search_settings_section() {
		_e('Which post types should be found in grid content search?', 'grid');
	}

	function sidebar_html() {
		$post_types = get_post_types( array('public' => true, 'show_ui' => true), 'objects' );
		$setting = get_option( 'grid_sidebar_post_type', '__NONE__' );
		?>
		<select id="grid_sidebar_post_type" name="grid_sidebar_post_type">
			<option value="__NONE__" <?php echo ( $setting == '__NONE__' ? 'selected' : '' );?>>Disable sidebar support</option>
			<?php
			foreach ( $post_types as $key => $post_type ) {
				?>
				<option value="<?php echo $key?>" <?php echo ( $key == $setting ? 'selected' : '' );?>><?php echo $post_type->labels->name?></option>
				<?php
			}
			?>
		</select>
		<?php
	}

	function default_container_section() {
		echo '';
	}

	function default_container_html() {
		$storage = grid_wp_get_storage();
		$containers = $storage->fetchContainerTypes();
		?>
		<select id="grid_default_container" name="grid_default_container">
			<option value="__NONE__"><?php _ex('Empty', 'default_container', 'grid'); ?></option>
			<?php
			foreach ( $containers as $container ) {
				$type = $container['type'];
				if ( 0 === strpos( $type, 'c-' ) ) {
					?>
					<option value="<?php echo $type?>" <?php echo ( get_option( 'grid_default_container' ) == $type ? 'selected' : '');?> ><?php echo $type?></option>
					<?php
				}
			}
			?>
		</select>
		<?php
	}

	function debug_mode_section() {
		echo '';
	}

	function debug_mode_html() {

		$value = get_option( 'grid_debug_mode', false );
		?>
		<input type="checkbox" id="grid_debug_mode" name="grid_debug_mode" <?php echo ( $value ? 'checked' : '' );?>> <?php echo ( $value ? 'Enabled' : 'Disabled' )?>
		<?php
	}

	function async_section() {
		echo '';
	}

	function async_enable_html() {

		$value = get_option( 'grid_async', false );
		?>
		<input type="checkbox" id="grid_async" name="grid_async" <?php echo ( $value ? 'checked' : '' );?>> <?php echo ( $value ? 'Enabled' : 'Disabled' )?>
		<?php
	}

	function async_url_html() {

		$value = get_option( 'grid_async_url', '' );
		?>
		<input type="text" id="grid_async_url" name="grid_async_url" value="<?php echo $value; ?>" />
		<?php
	}

  	function async_timeout_html() {
	  $value = get_option( 'grid_async_timeout', 5*60 );
	  ?>
	  <input type="number" id="grid_async_timeout" name="grid_async_timeout" value="<?php echo $value; ?>" />
	  <?php
  	}

	function mediaselect_info_section(){
		echo '';
	}

	function mediaselect_info_html() {
		$value = get_option( 'grid_mediaselect_info', '' );
		?>
		<textarea id="grid_mediaselect_info" name="grid_mediaselect_info" rows="4" cols="50"><?php echo $value ?></textarea>
		<?php
	}

	function mediaselect_types_section(){
		echo '';
	}

	function mediaselect_types_html() {
		$value = get_option( 'grid_mediaselect_types', 'image' );
		?>
		<p>
		<select id="grid_mediaselect_types" name="grid_mediaselect_types">
			<option value="image" <?php echo ($value == "image")? "selected": ""; ?> >Images</option>
			<option value="*" <?php echo ($value == "*")? "selected": ""; ?> >All</option>
		</select></p>
		<?php
	}

	function permalinks_section() {
		echo '';
	}

	function permalinks_html() {
		$value = get_option( 'grid_permalinks', '' );
		?>
		<input type="text" id="grid_permalinks" name="grid_permalinks" value="<?php echo $value ?>" />
		<?php
	}

}
