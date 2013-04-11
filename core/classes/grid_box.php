<?php

class grid_box extends grid_base {
	public $boxid;
	public $style; // Define the Style of Boxes
	public $title;
	public $titleurl;
	public $readmore;
	public $readmoreurl;
	public $prolog;
	public $epilog;
	public $layout;
	public $language;
	public $content;

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
		if(file_exists(dirname(__FILE__).'/../templates/box-'.$this->type().'.tpl.php'))
			include dirname(__FILE__).'/../templates/box-'.$this->type().'.tpl.php';
		else
			include dirname(__FILE__).'/../templates/box-box.tpl.php';
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
	
	
}
