<?php

class grid_slot extends grid_base {
	public $grid;
	public $slotid;
	public $style;
	public $boxes;

	public function render($editmode, $slotstyle,$container)
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
	
	public function addBox($idx,$box)
	{
		$list=$this->boxes;
		array_splice($list, $idx,0,array($box));
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;		
	}
	
	public function removeBox($idx)
	{
		$list=$this->boxes;
		array_splice($list, $idx,1);
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;
	}
	
	public function setStyle($style)
	{
		$this->style=$style;
		return $this->storage->persistSlot($this);
	}
}