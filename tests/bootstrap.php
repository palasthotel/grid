<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/Doubles.php';
require __DIR__ . '/../components/grid_box.php';
require __DIR__ . '/../components/grid_error_box.php';

// grid_box reads the integration's templates from the API; tests do not render
( new \ReflectionProperty( \Palasthotel\Grid\API::class, 'template' ) )->setValue( null, new class implements \Palasthotel\Grid\iTemplate {
	public function getPath( string $filename ) { return false; }
	public function grid( \grid_grid $grid ): string { return ''; }
	public function container( \grid_container $container ): string { return ''; }
	public function slot( \grid_slot $slot ): string { return ''; }
	public function box( \grid_box $box, bool $editmode ): string { return ''; }
} );

// integrations provide t() for translations
if ( ! function_exists( 't' ) ) {
	function t( $str ) {
		return $str;
	}
}
