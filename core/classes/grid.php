<?php

class grid extends gridbase {
	
	public $regions;
	public $gridid;

	public function render($editmode)
	{
		$regionmap=array();
		$regions=array();
		foreach($this->regions as $region)
		{
			$html=$region->render($editmode);
			$renderedregions[$region->regionid]=$html;
			$regions[]=$html;
		}
		ob_start();
		include dirname(__FILE__).'/../templates/grid.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
}