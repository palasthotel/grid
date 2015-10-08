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
	}
	function add_meta_boxes() {
		$post_types = get_post_types( array(), 'objects' );
		foreach ( $post_types as $key => $post_type ) {
			if ( get_option( 'grid_'.$key.'_enabled', false ) ) {
				add_meta_box( 'grid', __( 'Grid' ), array( $this, 'render_meta_box' ) , $key, 'side', 'high' );
			}
		}
	}
	function render_meta_box( $post ) {
		if ( get_option( 'grid_'.$post->post_type.'_enabled', false ) ) {
			$url = add_query_arg( array( 'page' => 'grid', 'postid' => $post->ID ), admin_url( 'admin.php' ) );
			?>
			<a href="<?php echo $url?>">Switch to the Grid</a>
			<?php
		} else {
			return false;
		}
	}
}