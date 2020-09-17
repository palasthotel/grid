<?php

namespace Palasthotel\Grid\Model;

use Palasthotel\Grid\Core;

/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class Slot extends _Base {
	public $grid;
	public $slotid;
	public $style;
	public $classes = array();
	public $boxes;
	public $dimension;
	public $config = NULL;

	public function __construct()
	{
		$this->boxes=array();
	}	


	
	public function addBox($idx,$box)
	{
		$this->storage->fireHook( Core::FIRE_SAVE_SLOT, (object)array( "operation" => "addBox", "box" => $box, "index" => $idx, "slot" => $this) );
		$list=$this->boxes;
		array_splice($list, $idx,0,array($box));
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;		
	}
	
	public function removeBox($idx)
	{
		$this->storage->fireHook( Core::FIRE_SAVE_SLOT, (object)array( "operation" => "removeBox", "index" => $idx, "slot" => $this) );
		$list=$this->boxes;
		array_splice($list, $idx,1);
		$this->boxes=$list;
		$this->storage->storeSlotOrder($this);
		return true;
	}
	
	public function setStyle($style)
	{
		$this->storage->fireHook( Core::FIRE_SAVE_SLOT, (object)array( "operation" => "setStyle", "style" => $style, "slot" => $this) );
		$this->style=$style;
		return $this->storage->persistSlot($this);
	}
}