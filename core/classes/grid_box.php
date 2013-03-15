<?php

class grid_box extends grid_base {
	public $boxid;
	public $title;
	public $titleurl;
	public $readmore;
	public $readmoreurl;
	public $prolog;
	public $epilog;
	public $layout;
	public $language;
	public $jason;

	public function type() {
		return 'box';
	}
	
	public function build($editmode) {
		//boxes render their content in here
		return '';
	}
	
	public function render($editmode) {
		$content=$this->build($editmode);
		ob_start();
		include dirname(__FILE__).'/../templates/box.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
	public function create_box () {
	  
	}
	
	public function read_box(){
	  
	}
	
	public function update_box(){
	  
	}
	
	public function delete_box() {
	  
	}
	
}