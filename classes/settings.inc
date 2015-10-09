<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 12:09
 */

namespace grid_plugin;


class settings
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
		global $wp_admin_bar;
		global $post;
		if ( isset( $post->grid ) ) {
			$wp_admin_bar->add_node( array(
				'id' => 'grid_wp_thegrid',
				'title' => 'Edit Grid',
				'href' => add_query_arg( array( 'page' => 'grid', 'postid' => $post->ID ), admin_url( 'admin.php' ) ),
			) );
		}
	}

	/**
	 * register admin menu page for settings
	 */
	function admin_menu(){
		add_submenu_page( 'options-general.php', 'Grid', 'Grid', 'manage_options', 'grid_settings', array( $this, 'render_settings_form' ) );
	}

	/**
	 * render settings form
	 */
	function render_settings_form() {
		?>
		<div class="wrap">
			<?php screen_icon(); ?>
			<h2>Grid Settings</h2>
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
		add_settings_section( 'grid_default_styles', 'Default Styles', array( $this, 'default_styles_settings_section' ), 'grid_settings' );
		add_settings_field( 'grid_default_container_style', 'Container Style', array( $this, 'default_container_style_html' ), 'grid_settings', 'grid_default_styles' );
		register_setting( 'grid_settings', 'grid_default_container_style' );
		add_settings_field( 'grid_default_slot_style', 'Slot Style', array( $this, 'default_slot_style_html' ), 'grid_settings', 'grid_default_styles' );
		register_setting( 'grid_settings', 'grid_default_slot_style' );
		add_settings_field( 'grid_default_box_style', 'Box Style', array( $this, 'default_box_style_html' ), 'grid_settings', 'grid_default_styles' );
		register_setting( 'grid_settings', 'grid_default_box_style' );

		/**
		 * enabled post types for grid
		 */
		add_settings_section( 'grid_post_types', 'Post Types', array( $this, 'post_type_settings_section' ), 'grid_settings' );
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
		add_settings_field( 'grid_landing_page_enabled', "Landing Pages", array( $this, 'post_type_html' ), 'grid_settings', 'grid_post_types', array( 'type' => 'landing_page') );
		register_setting( 'grid_settings', 'grid_landing_page_enabled' );
		add_settings_field( 'grid_sidebar_enabled', "Sidebars", array( $this, 'post_type_html' ), 'grid_settings', 'grid_post_types', array( 'type' => 'sidebar') );
		register_setting( 'grid_settings', 'grid_sidebar_enabled' );

		/**
		 * post types for search
		 */
		add_settings_section( 'grid_post_types_search', 'Post Types for content search', array( $this, 'post_type_search_settings_section' ), 'grid_settings' );
		$post_types = get_post_types( array('public' => true, 'show_ui' => true), 'objects' );
		foreach ( $post_types as $key => $post_type ) {
			add_settings_field( 'grid_'.$key.'_search_enabled', $post_type->labels->name, array( $this, 'post_type_search_html' ), 'grid_settings', 'grid_post_types_search', array( 'type' => $key ) );
			register_setting( 'grid_settings', 'grid_'.$key.'_search_enabled' );
		}


		/**
		 * sidebar post type
		 */
		add_settings_field( 'grid_sidebar_post_type', 'Which post type to use as sidebar content', array( $this, 'sidebar_html' ), 'grid_settings', 'grid_post_types' );
		register_setting( 'grid_settings', 'grid_sidebar_post_type' );

		/**
		 * default grid container
		 */
		add_settings_section( 'grid_default_container', 'New Grids', array( $this, 'default_container_section' ), 'grid_settings' );
		add_settings_field( 'grid_default_container', 'Which container should be placed automatically', array( $this, 'default_container_html' ), 'grid_settings', 'grid_default_container' );
		register_setting( 'grid_settings', 'grid_default_container' );

		/**
		 * debug mode
		 */
		add_settings_section( 'grid_debug_mode', 'Debug Mode', array( $this, 'debug_mode_section' ), 'grid_settings' );
		add_settings_field( 'grid_debug_mode', 'Turn debug mode on/off', array( $this, 'debug_mode_html' ), 'grid_settings', 'grid_debug_mode' );
		register_setting( 'grid_settings', 'grid_debug_mode' );

		/**
		 * mediaselect info
		 */
		add_settings_section( 'grid_mediaselect_info', 'Mediaselect Info', array( $this, 'mediaselect_info_section' ), 'grid_settings' );
		add_settings_field( 'grid_mediaselect_info', 'Set an info text for media in the WordPress media-box', array( $this, 'mediaselect_info_html' ), 'grid_settings', 'grid_mediaselect_info' );
		register_setting( 'grid_settings', 'grid_mediaselect_info' );

		/**
		 * permalinks
		 */
		add_settings_section( 'grid_permalinks', 'Grid', array( $this, 'permalinks_section' ), 'grid_settings' );
		add_settings_field( 'grid_permalinks', 'Landing Page base', array( $this, 'permalinks_html' ), 'grid_settings', 'grid_permalinks' );
		register_setting( 'grid_settings', 'grid_permalinks' );
	}

	function default_styles_settings_section() {
		echo 'Set which default styles should be applied.';
	}

	function default_container_style_html() {
		$storage = grid_wp_get_storage();
		$types = $storage->fetchContainerStyles();
		$setting = get_option( 'grid_default_container_style', '__NONE__' );
		?>
		<select id="grid_default_container_style" name="grid_default_container_style">
			<option value="__NONE__" <?php echo ( $setting == '__NONE__' ? 'selected' : '' ) ?>>None</option>
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
			<option value="__NONE__" <?php echo ( $setting == '__NONE__' ? 'selected' : '' );?>>None</option>
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
			<option value="__NONE__" <?php echo ( $setting == '__NONE__' ? 'selected' : '');?>>None</option>
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
		<input type="checkbox" id="grid_<?php echo $posttype?>_enabled" name="grid_<?php echo $posttype?>_enabled" type=checkbox <?php echo ( $value ? 'checked' : '' )?>> <?php echo ($value ? "Enabled": "Disabled") ?>
		<?php
	}

	function post_type_settings_section() {
		echo 'Which post types should have grid support?';
	}

	function post_type_search_html( $args ) {
		$posttype = $args['type'];
		$value = get_option( 'grid_'.$posttype.'_search_enabled', false );
		?>
		<input type="checkbox" id="grid_<?php echo $posttype?>_search_enabled" name="grid_<?php echo $posttype?>_search_enabled" type=checkbox <?php echo ( $value ? 'checked' : '' )?>> <?php echo ($value ? "Enabled": "Disabled") ?>
		<?php
	}

	function post_type_search_settings_section() {
		echo 'Which post types should be found in grid content search?';
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
			<option value="__NONE__">Empty</option>
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
		<input type="checkbox" id="grid_debug_mode" name="grid_debug_mode" type=checkbox <?php echo ( $value ? 'checked' : '' );?>> <?php echo ( $value ? 'Enabled' : 'Disabled' )?>
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