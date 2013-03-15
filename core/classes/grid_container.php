<?php

class grid_container extends grid_base {
	public $containerid;
	public $title;
	public $titleurl;
	public $readmore;
	public $readmoreurl;
	public $prolog;
	public $epilog;

	public $slots;

	public function render($editmode)
	{
		$slots=array();
		foreach($this->slots as $slot)
		{
			$slots[]=$slot->render($editmode);
		}
		ob_start();
		include dirname(__FILE__).'/../templates/container.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
	public function create_container () {
	  
	}
	
	public function read_container(){
	  
	}
	
	public function update_container(){
	  
	}
	
	public function delete_container() {
	  
	}
	
	public function add_slot ($slotid) {
	  
	}
	
	public function move_slot ($slotid) {
	  
	}
	
	public function remove_slot ($slotid) {
	  
	}
	
	
}