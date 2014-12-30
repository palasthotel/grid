<?php
/**
 * Plugin Name: Grid Twitterbox
 * Description: Adds a twitter box to grid
 * @version: 1.2
 * @author Palasthotel <rezeption@palasthotel.de> (in person: Benjamin Birkenhake, Edward Bock, Enno Welbers)
 * Author URI: http://www.palasthotel.de
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */

require_once 'grid_twitterbox/twitteroauth/twitteroauth.php';

function grid_wp_twitterbox_define_boxes() {
	require( 'grid_twitterbox/grid_wp_twitterboxes.php' );
}
add_action( 'grid_load_classes', 'grid_wp_twitterbox_define_boxes' );

function grid_wp_twitterbox_admin_menu() {
	add_submenu_page( 'options-general.php', 'Grid Twitterbox', 'Grid Twitterbox', 'manage_options', 'grid_wp_twitterbox_settings', 'grid_wp_twitterbox_settings' );
	add_submenu_page( null, 'Grid Twitter Callback', 'Grid Twitter Callback', 'manage_options', 'grid_wp_twitterbox_callback', 'grid_wp_twitterbox_callback' );
}
add_action( 'admin_menu', 'grid_wp_twitterbox_admin_menu' );

function grid_wp_twitterbox_settings() {
	if ( isset( $_POST ) && ! empty( $_POST ) ) {
		update_option( 'grid_twitterbox_consumer_key', $_POST['grid_twitterbox_consumer_key'] );
		update_option( 'grid_twitterbox_consumer_secret', $_POST['grid_twitterbox_consumer_secret'] );

		$connection = new TwitterOAuth( get_option( 'grid_twitterbox_consumer_key', '' ), get_option( 'grid_twitterbox_consumer_secret', '' ) );
		$request_token = $connection->getRequestToken( add_query_arg( array( 'page' => 'grid_wp_twitterbox_callback', 'noheader' => true ), admin_url( 'admin.php' ) ) );
		session_start();
		$_SESSION['oauth_token'] = $token = $request_token['oauth_token'];
		$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
		$url = $connection->getAuthorizeURL( $token );
		header( 'Location: ' . $url );
		die();
	} else {
?>
<form method="POST" action="<?php echo add_query_arg( array( 'noheader' => true, 'page' => 'grid_wp_twitterbox_settings' ), admin_url( 'options-general.php' ) ) ?>">
<label for="grid_twitterbox_consumer_key">Consumer Key:</label>
<input type="text" name="grid_twitterbox_consumer_key" value="<?php echo get_option( 'grid_twitterbox_consumer_key', '' );?>">
<label for="grid_twitterbox_consumer_secret">Consumer Secret:</label>
<input type="text" name="grid_twitterbox_consumer_secret" value="<?php echo get_option( 'grid_twitterbox_consumer_secret', '' );?>">
<input type="submit" value="Save and authenticate">
</form>
Access Token:
<pre>
<?php
	var_dump( get_option( 'grid_twitterbox_accesstoken' ) );
?>
</pre>
<?php
	}
}

function grid_wp_twitterbox_callback() {
	session_start();
	$connection = new TwitterOAuth( get_option( 'grid_twitterbox_consumer_key', '' ), get_option( 'grid_twitterbox_consumer_secret', '' ), $_SESSION['oauth_token'], $_SESSION['oauth_token_secret'] );
	
	/* Request access tokens from twitter */
	$access_token = $connection->getAccessToken( $_REQUEST['oauth_verifier'] );
	update_option( 'grid_twitterbox_accesstoken', $access_token );
	echo 'Done! We\'re authenticated';
}