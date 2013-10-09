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
	public $position;
	public $iscontentcontainer;
	public $firstcontentcontainer;
	public $lastcontentcontainer;
	public $slots;


		
	public function render($editmode)
	{
		$slots = array();
		$slotstyle = explode("-", $this->type);
		// print_r($slotstyle);
		switch (count($this->slots)) 
		{
			case 0:
				$this->style.= " has-no-slot ";
				break;
			case 1:
				$this->style.= " has-one-slot ";
				break;
			default:
				$this->style.= " has-multiple-slots ";
				break;
		}
		if($this->type[0]=='S' && $editmode==FALSE)
		{
			$slot=$this->slots[0];
			$style="sidebar ".$this->type." slot-first slot-last has-one-box";
			$output=$slot->render($editmode,$style,$this);
			return $output;
		}
		else
		{
			$counter = 0;
			foreach($this->slots as $slot)
			{
				$counter++;
				$style = " slot-".$slotstyle[$counter];
			  
			  	switch (count($slot->boxes)) {
			  		case 0:
			  			$style.= " has-no-box";
			  			break;
			  		case 1:
			  			$style.= " has-one-box";
			  			break;
			  		default:
			  			$style.= " has-multiple-boxes";
			  			break;
			  	}
				if ($slot == end($this->slots)){
				   // style: set flag for last slot element
					$style.=" slot-last";
				}
				if ($slot == reset($this->slots)){
				   // style: set flag for last slot element
					$style.=" slot-first";
				}
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
	
	public function is_content_container(){
		if($this->type == "C-8-0" or $this->type == "C-4-4-0"){
			$this->iscontentcontainer = true;
			return true;
		}else{
			$this->iscontentcontainer = false;
			return false;
		}
	}
	
}