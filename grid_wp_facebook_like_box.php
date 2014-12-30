<?php
/**
 * Plugin Name: Grid Facebook like box
 * Description: Adds a facebook like box to grid
 * @version: 1.2
 * @author Palasthotel <rezeption@palasthotel.de> (in person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */

 
function grid_wp_facebook_like_box_define_boxes() {
	require( 'grid_facebook_like_box/grid_fb_like_box_box.php' );
}
add_action( 'grid_load_classes', 'grid_wp_facebook_like_box_define_boxes' );