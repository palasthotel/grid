<?php
class grid_error_box extends grid_box {

	/**
	* Class constructor
	*
	* Constructor initializes editor widgets.
	*/
	public function __construct($msg) {
		$this->content=new Stdclass();
		$this->content->error_msg=$msg;
	}

	public function type()
	{
		return 'error';
	}

	public function build($editmode) {
		return "Box Error: ".$this->content->error_msg;
	}

}

?>