<?php

use Palasthotel\Grid\API;
use Palasthotel\Grid\iTemplate;
use Palasthotel\Grid\Model\Box;

/**
 * @property iTemplate template
 */
class grid_box extends Box {

	public function __construct() {
		parent::__construct();
		$this->template = API::template();
	}

	/**
	 * Box renders its content here.
	 *
	 * @param boolean $editmode checks if box is in editmode or frontend.
	 *
	 * @return string
	 */
	public function build( $editmode ) {
		return '';
	}

	/**
	 * Box renders itself here.
	 *
	 * @param boolean $editmode
	 *
	 * @return mixed
	 */
	public function render( $editmode ) {
		$found           = false;
		$this->classes[] = "grid-box-" . $this->type();
		$this->storage->fireHook( API::FIRE_WILL_RENDER_BOX, (object) array( "box" => $this, 'editmode' => $editmode ) );

		ob_start();
		$content = $this->build($editmode);
		include $this->template::box($this, $editmode);
		$output = ob_get_contents();
		ob_end_clean();

		$this->storage->fireHook( API::FIRE_DID_RENDER_BOX, (object) array( "box" => $this, 'editmode' => $editmode ) );

		return $output;
	}



	/**
	 * renders content in template file
	 *
	 * @param $content
	 * @param $file_path
	 */
	private function renderContent( $content, $file_path ) {
		include $file_path;
	}

}