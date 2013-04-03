<?php

class grid_slot extends grid_base {
	public $slotid;

	public $boxes;

	public function render($editmode)
	{
		$boxes=array();
		foreach($this->boxes as $box)
		{
			$boxes[]=$box->render($editmode);
		}
		ob_start();
		include dirname(__FILE__).'/../templates/slot.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
	public function create() {
	  
	}
	
	public function read(){
	  
	}
	
	public function update(){
	  
	}
	
	public function delete() {
	  
	}
	
	public function add_box ($boxid) {
	  
	}
	
	public function move_box ($boxid) {
	  
	}
	
	public function remove_box ($boxid) {
	  
	}
	
}