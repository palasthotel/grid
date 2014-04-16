<?php

class grid_container extends grid_base {
	public $grid;
	public $containerid;
	public $type; // The Type defines how many Slots a Container has, an how they are proportioned.
	public $style; // Allows to separete diffente Styles of Containers.
	public $classes = array();
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
	public $sidebarleft = false;
	public $slots;


		
	public function render($editmode)
	{
		switch (count($this->slots)) 
		{
			case 0:
				$this->classes[] = "has-no-slot";
				break;
			case 1:
				$this->classes[] = "has-one-slot";
				break;
			default:
				$this->classes[] = "has-multiple-slots";
				break;
		}
		$slots = array();
		$slotstyle = explode("-", $this->type);
		
		if(strpos($this->type, "S-")===0 && $editmode==FALSE)
		{
			$slot=$this->slots[0];
			//$style="sidebar ".$this->type." slot-first slot-last has-one-box";
			array_push( $slot->classes, "sidebar", $this->type, "slot-first", "slot-last", "has-one-box");
			$output=$slot->render($editmode, $this);
			return $output;
		}
		else
		{
			$counter = 0;
			if($slotstyle[1] == 0){
				// leftside 0 for sidebar
				$counter = 1;
				$this->sidebarleft = true;
			} 
			
			foreach($this->slots as $slot)
			{
				$counter++;
				$slot->classes[] = "slot-".$slotstyle[$counter];			  
			  	switch (count($slot->boxes)) {
			  		case 0:
			  			$slot->classes[] = "has-no-box";
			  			break;
			  		case 1:
			  			$slot->classes[] = "has-one-box";
			  			break;
			  		default:
			  			$slot->classes[] = "has-multiple-boxes";
			  			break;
			  	}
				if ($slot == end($this->slots)){
				   // style: set flag for last slot element
					$slot->classes[] = "slot-last";
				}
				if ($slot == reset($this->slots)){
				   // style: set flag for last slot element
					$slot->classes[] = "slot-first";
				}
				$slots[]=$slot->render($editmode, $this);
			}
			ob_start();
			if($this->storage->templatesPath!=NULL && file_exists($this->storage->templatesPath."/grid_container.tpl.php"))
				include $this->storage->templatesPath.'/grid_container.tpl.php';
			else
				include dirname(__FILE__).'/../templates/frontend/grid_container.tpl.php';
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
		if($this->type == "C-8-0" || $this->type == "C-4-4-0" 
			|| $this->type == "C-12" || $this->type == "C-6-6-0" || $this->type == "C-4-4-4-0" || $this->type == "C-3-3-3-3-0" || $this->type == "C-2-2-4-0"
			|| $this->type == "C-4-2-2-0" || $this->type == "C-2-2-2-2-0"
			|| $this->type == "C-0-8" || $this->type == "C-0-4-4" || $this->type == "C-0-6-6" || $this->type == "C-0-4-4-4" || $this->type == "C-0-3-3-3-3"){
			$this->iscontentcontainer = true;
			return true;
		}else{
			$this->iscontentcontainer = false;
			return false;
		}
	}
	
}