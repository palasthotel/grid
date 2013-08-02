<?php

class grid_container extends grid_base {
	public $grid;
	public $containerid;
	public $type; // The Type defines how many Slots a Container has, an how they are proportioned.
	public $style; // Allows to separete diffente Styles of Containers.
	public $title;
	public $titleurl;
	public $readmore;
	public $readmoreurl;
	public $prolog;
	public $epilog;
	public $reused;
	
	public $slots;

		
	public function render($editmode)
	{
		$slots = array();
		$slotstyle = explode("-", $this->type);
		// print_r($slotstyle);
		
		$counter = 0;
		foreach($this->slots as $slot)
		{
		  $counter++;
		  $pos ="";
			if ($slot == end($this->slots)){
			   // style: set flag for last slot element
				$pos=" slot_final";
			}
			if ($slot == reset($this->slots)){
			   // style: set flag for last slot element
				$pos=" slot_first";
			}
			$style = " slot_".$slotstyle[$counter].$pos;
			$slots[]=$slot->render($editmode, $style, $this);
		}
		ob_start();
		if($this->storage->templatesPath!=NULL && file_exists($this->storage->templatesPath."/grid_container.tpl.php"))
			include $this->storage->templatesPath.'/grid_container.tpl.php';
		else
			include dirname(__FILE__).'/../templates/grid_container.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
	public function update($data)
	{
		$this->style=$data->style;
		$this->title=$data->title;
		$this->titleurl=$data->titleurl;
		$this->readmore=$data->readmore;
		$this->readmoreurl=$data->readmoreurl;
		$this->prolog=$data->prolog;
		$this->epilog=$data->epilog;
		return $this->storage->persistContainer($this);
	}
}