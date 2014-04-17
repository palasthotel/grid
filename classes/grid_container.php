<?php

class grid_container extends grid_base {
	public $grid;
	public $containerid;
	public $type; // Type is one of c (container), s(sidebar), sc (container for sidebar editor), i(invisible)
	public $dimension; // The dimension defines how many Slots a Container has, an how they are proportioned.
	public $space_to_left;
	public $space_to_right;
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
				$this->classes[] = "grid-container-has-no-slot";
				break;
			case 1:
				$this->classes[] = "grid-container-has-one-slot";
				break;
			default:
				$this->classes[] = "grid-container-has-multiple-slots";
				break;
		}
		
		if( $this->type == "s" && $editmode==FALSE)
		{
			$slot=$this->slots[0];
			array_push( $slot->classes, 
							"grid-slot-sidebar", 
							"grid-slot-".$this->dimension, 
							"grid-slot-first", 
							"grid-slot-last", 
							"grid-slot-has-one-box");
			$output=$slot->render($editmode, $this);
			return $output;
		}
		else
		{
			if($this->space_to_right){
				$this->sidebarleft = true;
			} else if($this->space_to_left){
				$this->sidebarright = true;
			}
			$counter = 0;
			$slots_dimension = explode("-", $this->dimension);
			foreach($this->slots as $slot)
			{
				$slot->dimension = $slots_dimension[$counter++];			  
			  	switch (count($slot->boxes)) {
			  		case 0:
			  			$slot->classes[] = "grid-slot-has-no-box";
			  			break;
			  		case 1:
			  			$slot->classes[] = "grid-slot-has-one-box";
			  			break;
			  		default:
			  			$slot->classes[] = "grid-slot-has-multiple-boxes";
			  			break;
			  	}
				if ($slot == end($this->slots)){
					$slot->classes[] = "grid-slot-last";
				}
				if ($slot == reset($this->slots)){
					$slot->classes[] = "grid-slot-first";
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
		if($this->type == "c" && ($this->space_to_left || $this->space_to_right)){
			$this->iscontentcontainer = true;
			return true;
		}else{
			$this->iscontentcontainer = false;
			return false;
		}
	}
	
}