<?php


namespace Palasthotel\Grid;


use mysqli_result;

interface iQuery {

	/**
	 * @return string
	 */
	public function prefix();

	/**
	 * @param string $sql
	 *
	 * @return mysqli_result
	 */
	public function execute( $sql );

	/**
	 * @param string $str
	 *
	 * @return string mixed
	 */
	public function real_escape_string( $str );
}