<?php


use Palasthotel\Grid\API;
use Palasthotel\Grid\Core;
use Palasthotel\Grid\Model\Container;

class grid_container extends Container {
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
				$slot->boxes = array_filter( $slot->boxes, function ( $box ) {
					return ! ( $box instanceof grid_container_configuration_box || $box instanceof grid_slot_configuration_box );
				} );
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
		$found = FALSE;
		if( is_array( $this->storage->templatesPaths ) )
		{
			foreach ($this->storage->templatesPaths as $templatesPath)
			{
				$template_path = rtrim($templatesPath."/grid-container.tpl.php", "/");
				if( file_exists($template_path) ){
					include $template_path;
					$found = TRUE;
					break;
				}
			}

		}
		if(!$found)
		{
			include dirname(__FILE__).'/../templates/grid-container.tpl.php';
		}
		$output=ob_get_clean();

		$this->storage->fireHook( API::FIRE_DID_RENDER_CONTAINER, (object) array( "container" => $this, 'editmode' =>$editmode) );

		return $output;


	}
}