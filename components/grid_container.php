<?php

use Palasthotel\Grid\API;
use Palasthotel\Grid\iTemplate;
use Palasthotel\Grid\Model\Container;

/**
 * @property iTemplate template
 */
class grid_container extends Container {

	public function __construct() {
		parent::__construct();
		$this->template = API::template();
	}

	/**
	 * @param Container $model
	 *
	 * @return grid_container
	 */
	public static function build($model){
		$self = new self();
		foreach ($model as $prop => $value){
			$self->{$prop} = $value;
		}
		$self->slots = array_map(function($slot){
			return grid_slot::build($slot);
		}, $self->slots);
		return $self;
	}

	public function render($editmode)
	{
		$this->classes[] = "grid-container";
		$this->classes[] = "grid-container-".$this->type;

		$this->storage->fireHook( API::FIRE_WILL_RENDER_CONTAINER, (object) array( "container" => $this, 'editmode' =>$editmode) );

		if(!$editmode){

			foreach ( $this->slots as $slot ) {

				// iterate over boxes to find configuration boxes
				foreach ( $slot->boxes as $box ) {

					if ( $box instanceof grid_container_configuration_box || $box instanceof grid_slot_configuration_box ) {
						foreach ( $box->build( false ) as $key => $value ) {

							if ( $box instanceof grid_container_configuration_box ) {
								if ( ! is_array( $this->config ) ) {
									$this->config = array();
								}
								$this->config[ $key ] = $value;

							}
							if ( $box instanceof grid_slot_configuration_box ) {
								if ( ! is_array( $slot->config ) ) {
									$slot->config = array();
								}
								$slot->config[ $key ] = $value;
							}

						}

					}

				}

				// remove from grid to prevent rendering in frontend
				$slot->boxes = array_values(array_filter( $slot->boxes, function ( $box ) {
					return ! ( $box instanceof grid_container_configuration_box || $box instanceof grid_slot_configuration_box );
				} ));
			}

		}

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

		// prepare slot dimensions
		$type_arr = explode("-", $this->type);
		$counter = 0;
		$slots_dimension = array_slice($type_arr,1);
		if($slots_dimension[$counter] == "0") $counter++;

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
		include $this->template->container($this);
		$output=ob_get_contents();
		ob_end_clean();

		$this->storage->fireHook( API::FIRE_DID_RENDER_CONTAINER, (object) array( "container" => $this, 'editmode' =>$editmode) );

		return $output;


	}
}
