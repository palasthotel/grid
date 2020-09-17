<?php


use Palasthotel\Grid\API;
use Palasthotel\Grid\Core;
use Palasthotel\Grid\Model\Container;
use Palasthotel\Grid\Model\Grid;

class grid_grid extends Grid {
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


		$found = FALSE;
		if( is_array( $this->storage->templatesPaths) )
		{
			foreach ($this->storage->templatesPaths as $templatesPath) {
				$template_path = rtrim($templatesPath.'/grid.tpl.php', "/");
				if( file_exists($template_path) ){
					include $template_path;
					$found = TRUE;
					break;
				}
			}

		}
		if(!$found)
		{
			include dirname( __FILE__ ) . '/../templates/grid.tpl.php';
		}

		$output=ob_get_clean();
		$this->storage->fireHook( API::FIRE_DID_RENDER_GRID, (object) array( 'grid' =>$this, 'editmode' =>$editmode));
		return $output;
	}
}