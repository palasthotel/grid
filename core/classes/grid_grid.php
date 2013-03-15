<?php

class grid_grid extends grid_base {
	
	public $container;
	public $gridid;

	public function render($editmode)
	{
		$containermap=array();
		$containerlist=array();
		foreach($this->container as $container)
		{
			$html=$container->render($editmode);
			$containermap[$container->containerid]=$html;
			$containerlist[]=$html;
		}
		ob_start();
		include dirname(__FILE__).'/../templates/grid.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
	public function create() {
	  
	}
	
	public function read(){
	  $query = "SELECT container_id FROM grid_grid2container WHERE grid_id ='".$this->gridid."'";
	}
	
	public function update(){
	  
	}
	
	public function delete() {
	  
	}
	
	public function add_container ($containerid) {
	  
	}
	
	public function move_container ($containerid) {
	  
	}
	
	public function remove_container ($containerid) {
	  
	}
	
	
}