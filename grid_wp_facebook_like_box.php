<?php
/**
 * Plugin Name: Grid Facebook like box
 * Description: Adds a facebook like box to grid
 * Version: 0.0
 * Author: Palasthotel (in Person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 */

 
function grid_wp_facebook_like_box_define_boxes() {
	require('grid_facebook_like_box/grid_fb_like_box_box.php');
}
add_action('grid_load_classes','grid_wp_facebook_like_box_define_boxes');