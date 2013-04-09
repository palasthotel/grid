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