<?php


namespace Palasthotel\Grid\WordPress;


/**
 * @property Plugin plugin
 * @property \wpdb wpdb
 */
class StorageHelper {

	/**
	 * Grid constructor.
	 *
	 * @param Plugin $plugin
	 */
	public function __construct($plugin) {
		$this->plugin = $plugin;
		global $wpdb;
		$this->wpdb = $wpdb;
	}

	/**
	 * @param int $postid
	 * @param int $gridid
	 *
	 * @return bool|int
	 */
	public function setPostGrid($postid, $gridid){
		return $this->wpdb->query(
			'insert into '.$this->wpdb->prefix."grid_nodes (nid,grid_id) values ($postid,$gridid)"
		);
	}

}