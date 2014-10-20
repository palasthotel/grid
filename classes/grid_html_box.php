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
class grid_html_box extends grid_static_base_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'html';
	}

	/**
	* Class constructor
	*
	* Constructor initializes editor widgets.
	*/
	public function __construct() {
		$this->content=new Stdclass();
		$this->content->html='';
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
		}
		else {
			return $this->content->html;
		}
	}
	
	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure () {
		return array(
			array(
				'key'=>'html',
				'label'=>t('Text'),
				'type'=>'html'
			),
		);
	}

}
