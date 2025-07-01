<?php


use Palasthotel\Grid\API;
use Palasthotel\Grid\iTemplate;
use Palasthotel\Grid\Model\Slot;

class grid_slot extends Slot {

    public iTemplate $template;

	public function __construct() {
		parent::__construct();
		$this->template = API::template();
	}

	/**
	 * @param Slot $model
	 *
	 * @return grid_slot
	 */
	public static function build($model){
		$self  = new self();
		foreach ($model as $prop => $value){
			$self->{$prop} = $value;
		}
		return $self;
	}

	public function render($editmode, $container)
	{
		$this->storage->fireHook( API::FIRE_WILL_RENDER_SLOT, (object) array( "container" =>$container, "slot" => $this, 'editmode' =>$editmode) );

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
		include $this->template->slot($this);
		$output=ob_get_contents();
		ob_end_clean();

		$this->storage->fireHook( API::FIRE_DID_RENDER_SLOT, (object) array( "container" =>$container, "slot" => $this, 'editmode' =>$editmode) );

		return $output;
	}
}
