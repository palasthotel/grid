<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 2019-04-26
 * Time: 15:21
 */

class grid_slot_configuration_box extends grid_structure_configuration_base_box{

	public function type() {
		return "slot_configuration";
	}

	public function build( $editmode ) {
		if($editmode) return "Slot configuration";
		return $this->content;
	}

}