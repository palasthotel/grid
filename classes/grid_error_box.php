<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/**
* Error-Box that displays Error if there are some when loading grid box classes
*/
class grid_error_box extends grid_box {

	/**
	* Class constructor
	*
	* Constructor initializes editor widgets.
	*/
	public function __construct($msg = "") {
		$this->content=new Stdclass();
		$this->content->error_msg=$msg;
	}

	public function type()
	{
		return 'error';
	}

	public function build($editmode) {
		return "Box Error: ".$this->content->error_msg;
	}

}

?>