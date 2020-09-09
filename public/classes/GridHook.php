<?php


namespace Palasthotel\Grid\WordPress;


use Palasthotel\Grid\iHook;

class GridHook implements iHook {

	public function fire( $name, $arguments ) {
		do_action( 'grid_' . $name, $arguments );
	}

	public function alter( $name, $value, $arguments ) {
		apply_filters( 'grid_' . $name, $value, $arguments );
	}
}