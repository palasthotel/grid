<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
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
		parent::__construct();
		$this->content->error_msg=$msg;
	}

	public function type() {
		return 'error';
	}

	public function build($editmode) {
		return "Box Error: ".$this->content->error_msg;
	}

}
