<?php

class grid_container extends grid_base {
	public $containerid;
	public $type; // The Type defines how many Slots a Container has, an how they are proportioned.
	public $style; // Allows to separete diffente Styles of Containers.
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
	
	public function create() {
	  
	}
	
	public function read(){
	  
	}
	
	public function update(){
	  
	}
	
	public function delete() {
	  
	}
	
	public function create_type() {
	  
	}
	
	public function read_type(){
	  
	}
	
	public function update_type(){
	  
	}
	
	public function delete_type() {
	  
	}
	
	public function create_style() {
	  
	}
	
	public function read_style(){
	  
	}
	
	public function update_style(){
	  
	}
	
	public function delete_style() {
	  
	}
	
	public function add_slot ($slotid) {
	  
	}
	
	public function move_slot ($slotid) {
	  
	}
	
	public function remove_slot ($slotid) {
	  
	}
	
	
}