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
}