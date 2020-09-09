<?php


namespace Palasthotel\Grid;


interface iHook {

	/**
	 * @param string $name
	 * @param mixed $arguments
	 *
	 * @return mixed
	 */
	public function fire($name, $arguments);

	/**
	 * @param string $name
	 * @param mixed $value
	 * @param mixed $arguments
	 *
	 * @return mixed
	 */
	public function alter($name, $value, $arguments);
}