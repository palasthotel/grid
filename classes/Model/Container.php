<?php

namespace Palasthotel\Grid\Model;

use Palasthotel\Grid\Core;

/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */


class Container extends _Base {
	public $grid;
	public $containerid;
	public $reusetitle;
	public $type; // Type is one of c (container), s(sidebar deprecated), sc (container for sidebar editor deprecated), i(invisible)
	public $type_id; // ID of the type as provided by database
	public $dimension; // The dimension defines how many Slots a Container has, an how they are proportioned.
	public $space_to_left;
	public $space_to_right;
	public $style; // Allows to separete diffente Styles of Containers.
	public $classes = array();
	public $title;
	public $titleurl;
	public $titleurltarget;
	public $readmore;
	public $readmoreurl;
	public $readmoreurltarget;
	public $prolog;
	public $epilog;
	public $reused;
	public $position;
	/**
	 * @var Slot[]
	 */
	public $slots;
	public $config = null;

	public function __construct()
	{
		$this->slots =array();
		$this->classes = array();
	}
	
	public function update($data)
	{
		$this->storage->fireHook( Core::FIRE_SAVE_CONTAINER, (object) array( "container" => $this, "data" => $data ));
		$this->style=$data->style;
		$this->title=$data->title;
		$this->titleurl=$data->titleurl;
		$this->titleurltarget=$data->titleurltarget;
		$this->readmore=$data->readmore;
		$this->readmoreurl=$data->readmoreurl;
		$this->readmoreurltarget=$data->readmoreurltarget;
		$this->prolog=$data->prolog;
		$this->epilog=$data->epilog;
		return $this->storage->persistContainer($this);
	}
	
}