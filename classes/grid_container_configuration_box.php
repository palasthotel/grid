<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 2019-04-26
 * Time: 15:21
 */

class grid_container_configuration_box extends grid_static_base_box{

	public function type() {
		return "container_configuration";
	}

	public function build( $editmode ) {
		if($editmode) return "Container configuration";
		return $this->content;
	}
}