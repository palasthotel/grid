<?php


use Palasthotel\Grid\API;
use Palasthotel\Grid\Core;
use Palasthotel\Grid\Model\Slot;

class grid_slot extends Slot {
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
			include dirname( __FILE__ ) . '/../templates/grid-slot.tpl.php';
		}
		$output=ob_get_clean();

		$this->storage->fireHook( API::FIRE_DID_RENDER_SLOT, (object) array( "container" =>$container, "slot" => $this, 'editmode' =>$editmode) );

		return $output;
	}
}