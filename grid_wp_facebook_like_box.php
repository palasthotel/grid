<?php
/**
 * Plugin Name: Grid Facebook like box
 * Plugin URI: https://github.com/palasthotel/grid/
 * Description: Adds a facebook like box to grid
 * Version: 1.3
 * Author: Palasthotel <rezeption@palasthotel.de> (in person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 * License: http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @copyright Copyright (c) 2014, Palasthotel
 * @package Palasthotel\Grid-WordPress
 */


function grid_wp_facebook_like_box_define_boxes() {
	require( 'grid_facebook_like_box/grid_fb_like_box_box.php' );
}
add_action( 'grid_load_classes', 'grid_wp_facebook_like_box_define_boxes' );