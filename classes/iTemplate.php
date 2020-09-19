<?php


namespace Palasthotel\Grid;


interface iTemplate {

	public static function grid(\grid_grid $grid): string;
	public static function container(\grid_container $container): string;
	public static function slot(\grid_slot $slot): string;
	public static function box(\grid_box $box, bool $editmode): string;

}