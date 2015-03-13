<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_slot extends grid_base {
	public $grid;
	public $slotid;
	public $style;
	public $classes = array();
	public $boxes;
	public $dimension;

	public function __construct()
	{
		$this->boxes=array();
	}	

	public function render($editmode, $container)
	{
		$boxes=array();
		if(count($this->boxes)>0)
		{
			$this->boxes[0]->classes[]="grid-box-first";
			$this->boxes[count($this->boxes)-1]->classes[]="grid-box-last";
		}

		foreach($this->boxes as $box)
		{
			$boxes[]=$box->render($editmode);
		}

		ob_start();
		$found = FALSE;
		if( is_array( $this->storage->templatesPaths) )
		{
			foreach ($this->storage->templatesPaths as $templatesPath) {
				$template_path = rtrim($templatesPath.'/grid-slot.tpl.php', "/");
				if( file_exists($template_path) ){
					include $template_path;
					$found = TRUE;
					break;
				}				
			}
			
		}
		if(!$found)
		{
			include dirname(__FILE__).'/../templates/frontend/grid-slot.tpl.php';
		}
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