<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 04.10.15
 * Time: 20:59
 */


/**
 * plugin deleted by admin interface do this
 */
function grid_wp_perform_uninstall()
{
	$posts=get_posts(array('post_type'=>'landing_page','posts_per_page'=>-1));
	foreach($posts as $post) {
		wp_delete_post($post->ID);
	}
	$posts=get_posts(array('post_type'=>'sidebar','posts_per_page'=>-1));
	foreach($posts as $post) {
		wp_delete_post($post->ID);
	}

	global $wpdb;
	global $grid_connection;
	global $grid_lib;
	$grid_connection = grid_wp_get_mysqli();

	delete_option('grid');
	delete_option('grid_landing_page_enabled');
	delete_option('grid_sidebar_enabled');
	delete_option('grid_sidebar_post_type');
	delete_option('grid_default_container');
	$schema = $grid_lib->getDatabaseSchema();
	$schema['grid_nodes']=array();
	$grid_lib->uninstall();
	foreach($schema as $tablename=>$data)
	{
		$query = 'drop table '.$wpdb->prefix.$tablename;
		$grid_connection->query( $query );
	}
}
function grid_wp_uninstall() {
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
				grid_wp_perform_uninstall();
			}
		}
	}
	else
	{
		grid_wp_perform_uninstall();
	}
}
register_uninstall_hook(__FILE__,'grid_wp_uninstall');