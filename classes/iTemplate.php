<?php


namespace Palasthotel\Grid;


interface iTemplate {

  /**
   * @param string $filename
   *
   * @return string|false
   */
	public function getPath( string $filename );
	public function grid(\grid_grid $grid): string;
	public function container(\grid_container $container): string;
	public function slot(\grid_slot $slot): string;
	public function box(\grid_box $box, bool $editmode): string;

}
