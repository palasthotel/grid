<?php
/**
 * Created by PhpStorm.
 * User: edward
 * Date: 05.08.16
 * Time: 15:15
 */

namespace Palasthotel\Grid\WordPress;


class PositionInPost {

	const FILTER_OVERWRITE = "grid_position_in_post";

	/**
	 * post meta key
	 */
	const META_KEY = "_grid_position_in_post";
	
	/**
	 * values
	 */
	const POSITION_TOP = "top";
	const POSITION_BOTTOM = "bottom";
	const POSITION_ONLY = "only";
	const POSITION_NONE = "none";
}