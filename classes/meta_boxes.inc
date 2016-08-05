<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 20:18
 */

namespace grid_plugin;


class meta_boxes
{
	function __construct(){
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action('save_post', array($this, 'save_post'));
	}
	function add_meta_boxes() {
		
		$post_types = get_post_types( array(), 'objects' );
		foreach ( $post_types as $key => $post_type ) {
			if ( get_option( 'grid_'.$key.'_enabled', false ) ) {
				add_meta_box( 'grid', __( 'Grid', 'grid' ), array( $this, 'render_meta_box' ) , $key, 'side', 'high' );
			}
		}
	}
	
	/**
	 * render the metabox content
	 * @param $post
	 *
	 * @return bool
	 */
	function render_meta_box( $post ) {
		
		if( get_post_status($post->ID) == 'auto-draft' ){
			?>
			<input type="hidden" name="grid[<?php echo PositionInPost::META_KEY ?>]" value="<?php echo PositionInPost::POSITION_BOTTOM ?>" />
			<p><?php _e('Save post before you can use grid.', 'grid'); ?></p>
			<?php
		} else if ( get_option( 'grid_'.$post->post_type.'_enabled', false ) ) {
			$url = add_query_arg( array( 'page' => 'grid', 'postid' => $post->ID ), admin_url( 'admin.php' ) );
			
			?>
			<a class="button" href="<?php echo $url?>"><?php _e('Switch to the Grid', 'grid'); ?></a>
			<?php
				/**
				 * - oben drüber
				 * - unten drunter
				 * - nur grid
				 * - nur the content
				 * SHORTCODE
				 */
				$val = get_post_meta($post->ID, PositionInPost::META_KEY, true);
				
				?>
				<p><strong><?php _e('Position of grid', 'grid'); ?></strong></p>
				<label
					for="grid-position"
					class="screen-reader-text"
				><?php _e('Position of grid', 'grid'); ?></label>
				<select
					id="grid-position"
					name="grid[<?php echo PositionInPost::META_KEY ?>]"
				>
					<?php $this->render_position_option(__('Append to content', 'grid'), PositionInPost::POSITION_BOTTOM, $val); ?>
					<?php $this->render_position_option(__('Prepend to content', 'grid'), PositionInPost::POSITION_TOP, $val); ?>
					<?php $this->render_position_option(__('Grid only, no content', 'grid'), PositionInPost::POSITION_ONLY, $val); ?>
					<?php $this->render_position_option(__('Disable grid rendering', 'grid'), PositionInPost::POSITION_NONE, $val); ?>
				</select>
				<?php
			
			do_action('grid_post_edit_meta_box');
		} else {
			return false;
		}
	}
	
	/**
	 * render select option
	 * @param $label
	 * @param $position
	 * @param $value
	 */
	private function render_position_option($label, $position, $value){
		?>
		<option
			value="<?php echo $position ?>"
			<?php if($position == $value) echo " selected='selected' " ?>
		>
			<?php echo $label ?>
		</option>
		<?php
	}
	
	/**
	 * save post
	 * @param $post_id
	 */
	function save_post($post_id){
		if(!empty($_POST["grid"]) && !empty($_POST["grid"][PositionInPost::META_KEY])){
			update_post_meta($post_id, PositionInPost::META_KEY,$_POST["grid"][PositionInPost::META_KEY]);
		}
	}
	
	
}