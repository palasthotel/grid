<?php

use Palasthotel\Grid\API;
use Palasthotel\Grid\Core;
use Palasthotel\Grid\iTemplate;
use Palasthotel\Grid\Model\Container;
use Palasthotel\Grid\Model\Grid;

/**
 * @property iTemplate template
 */
class grid_grid extends Grid {

	/**
	 * grid_grid constructor.
	 */
	public function __construct() {
		$this->template = API::template();
	}

	/**
	 * @param Grid $model
	 *
	 * @return grid_grid
	 */
	public static function build($model){
		$self = new self();
		foreach ($model as $prop => $value){
			$self->{$prop} = $value;
		}
		$self->container = array_map(function($container){
			return grid_container::build($container);
		}, $self->container);
		return $self;
	}

	/**
	 * @param bool $editmode
	 *
	 * @return string
	 */
	public function render($editmode)
	{
		$this->storage->fireHook( API::FIRE_WILL_RENDER_GRID, (object) array( 'grid' =>$this, 'editmode' =>$editmode));

		$containermap=array();
		$containerlist=array();

		foreach($this->container as $container)
		{
			/**
			 * @var $container Container
			 */
			$html=$container->render($editmode);
			$containermap[$container->containerid]=$html;
			$containerlist[]=$html;
		}

		ob_start();
		include API::template()::grid($this);
		$output=ob_get_contents();
		ob_end_clean();

		$this->storage->fireHook( API::FIRE_DID_RENDER_GRID, (object) array( 'grid' =>$this, 'editmode' =>$editmode));
		return $output;
	}
}
