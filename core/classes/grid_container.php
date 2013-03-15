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
}