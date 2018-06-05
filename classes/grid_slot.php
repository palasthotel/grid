<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

use Grid\Constants\Hook;

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
		$this->storage->fireHook(Hook::WILL_RENDER_SLOT, (object) array( "container"=>$container, "slot" => $this, 'editmode'=>$editmode) );
		
		$boxes=array();
		if(count($this->boxes)>0)
		{
			$this->boxes[0]->classes[]="grid-box-first";
			$this->boxes[count($this->boxes)-1]->classes[]="grid-box-last";
		}

		foreach($this->boxes as $box)
		{
			$boxes[]=$box->render($editmode, $container, $this);
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
		
		$this->storage->fireHook(Hook::DID_RENDER_SLOT, (object) array( "container"=>$container, "slot" => $this, 'editmode'=>$editmode) );
		
		return $output;
	}
	
	public function addBox($idx,$box)
	{
		$this->storage->fireHook( Hook::SAVE_SLOT, (object)array("operation" => "addBox", "box" => $box, "index" => $idx,  "slot" => $this) );
		$list=$this->boxes;
		array_splice($list, $idx,0,array($box));
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;		
	}
	
	public function removeBox($idx)
	{
		$this->storage->fireHook( Hook::SAVE_SLOT, (object)array("operation" => "removeBox", "index" => $idx, "slot" => $this) );
		$list=$this->boxes;
		array_splice($list, $idx,1);
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;
	}
	
	public function setStyle($style)
	{
		$this->storage->fireHook( Hook::SAVE_SLOT, (object)array("operation" => "setStyle", "style" => $style, "slot" => $this) );
		$this->style=$style;
		return $this->storage->persistSlot($this);
	}
}