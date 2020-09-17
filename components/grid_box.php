<?php

use Palasthotel\Grid\API;
use Palasthotel\Grid\Model\Box;

class grid_box extends Box {

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
		$typechecks   = array();
		$class        = get_class( $this );
		$typechecks[] = preg_replace( "/(?:grid_(.*)_box|grid_(box))/u", "$1$2", $class );
		while ( $class != false ) {
			$class        = get_parent_class( $class );
			$typechecks[] = preg_replace( "/(?:grid_(.*)_box|grid_(box))/u", "$1$2", $class );
		}
		foreach ( $typechecks as $type ) {
			if ( is_array( $this->storage->templatesPaths ) ) {
				foreach ( $this->storage->templatesPaths as $templatesPath ) {
					$found = $this->renderTemplate( $templatesPath, $editmode, $type );
					if ( $found ) {
						break;
					}
				}
			}
			if ( ! $found ) {
				$found = $this->renderTemplate( $this->storage->templatesPath, $editmode, $type );
			}
			if ( ! $found ) {
				$found = $this->renderTemplate( dirname( __FILE__ ) . '/../templates', $editmode, $type );
			}
			if ( $found ) {
				break;
			}
		}

		$output = ob_get_clean();
		$this->storage->fireHook( API::FIRE_DID_RENDER_BOX, (object) array( "box" => $this, 'editmode' => $editmode ) );

		return $output;
	}

	/**
	 * includes tempalte content
	 *
	 * @param String $templatesPath
	 * @param boolean $editmode
	 *
	 * @return boolean  found or not
	 */
	private function renderTemplate( $templatesPath, $editmode, $type ) {
		$templatesPath = rtrim( $templatesPath, "/" );
		$found         = false;
		if ( $templatesPath != null ) {
			$editmode_file = $templatesPath . '/grid-box-' . $type . '-editmode.tpl.php';
			$file          = $templatesPath . '/grid-box-' . $type . '.tpl.php';
			if ( $editmode && file_exists( $editmode_file ) ) {
				$found   = true;
				$content = $this->build( $editmode );
				$this->renderContent( $content, $editmode_file );
			}
			if ( ! $editmode && file_exists( $file ) ) {
				$found   = true;
				$content = $this->build( $editmode );
				$this->renderContent( $content, $file );
			}
		}

		return $found;
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