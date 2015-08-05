<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/**
* HTML-Box contents is considered a static content.
*/
class grid_wp_html_box extends grid_html_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'wp_html';
	}

	/**
	* Box determins its menu label and renders its content in here.
	*
	* @param boolean $editmode
	*
	* @return string
	*/
	public function build($editmode) {
		if($editmode && empty($this->content->html)) {
			return t("Static HTML-Content");
		} else if($editmode){
			return $this->content->html;
		} else {
			return do_shortcode($this->content->html);
		}
	}

}
