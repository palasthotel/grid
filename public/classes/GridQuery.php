<?php


namespace Palasthotel\Grid\WordPress;


use mysqli;
use mysqli_result;
use Palasthotel\Grid\AbstractQuery;

/**
 * Class GridQuery
 * @package Palasthotel\Grid\WordPress
 */
class GridQuery extends AbstractQuery {

	/**
	 * @return string
	 */
	public function prefix() {
		global $wpdb;
		return $wpdb->prefix;
	}

	/**
	 * @var mysqli
	 */
	var $connection;

	/**
	 * @return mysqli
	 */
	private function getConnection(){
		if($this->connection != null) return $this->connection;
		$host = DB_HOST;
		$port = 3306;
		if ( strpos( DB_HOST, ':' ) !== false ) {
			$db_host = explode( ':', DB_HOST );
			$host    = $db_host[0];
			$port    = intval( $db_host[1] );
		}
		$connection = new mysqli( $host, DB_USER, DB_PASSWORD, DB_NAME, $port );
		if ( $connection->connect_errno ) {
			error_log( "WP Grid: " . $connection->connect_error, 4 );
			wp_die( "WP Grid could not connect to database." );
		}
		$this->connection = $connection;
		return $connection;
	}

	/**
	 * @param string $sql
	 *
	 * @return mysqli_result
	 */
	public function execute( $sql ) {
		return $this->getConnection()->query($sql);
	}

	/**
	 * @param string $str
	 *
	 * @return string
	 */
	public function real_escape_string( $str ) {
		return $this->getConnection()->real_escape_string($str);
	}

	/**
	 * on object destruction
	 */
	public function __destruct(){
		if($this->connection) $this->connection->close();
	}
}