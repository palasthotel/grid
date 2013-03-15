<?php

class grid_slot extends grid_base {
	public $slotid;
	public $title;
	public $titleurl;
	public $readmore;
	public $readmoreurl;
	public $prolog;
	public $epilog;

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
	
	public function create_slot () {
	  
	}
	
	public function read_slot(){
	  
	}
	
	public function update_slot(){
	  
	}
	
	public function delete_slot() {
	  
	}
	
	public function add_box ($boxid) {
	  
	}
	
	public function move_box ($boxid) {
	  
	}
	
	public function remove_box ($boxid) {
	  
	}
	
}