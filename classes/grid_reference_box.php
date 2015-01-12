<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/** 
* Meta type "REFERENCE"
*
* Creates a new meta type used as category for boxes. 
*/
class grid_reference_box extends grid_box {

	/**
	* Class contructor
	*
	* Initializes editor widgets for backend
	*/
	public function __construct() {
		$this->content=new Stdclass();
		$this->content->boxid=-1;
	}
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'reference';
	}

	/**
	* Box renders its menu label and its content in here.
	*
	* @return mixed
	*/
	public function build($editmode) {
		$box=$this->storage->loadReuseBox($this->content->boxid);
		return $box->build($editmode);
	}
	
	/**
	* Box renders itself here.
	*
	* @return mixed
	*/
	public function render($editmode) {
		$box=$this->storage->loadReuseBox($this->content->boxid);
		$box->classes=$this->classes;
		return $box->render($editmode);
	}
	
	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure () {
		return array(
			array(
				'key'=>'boxid',
				'type'=>'hidden',
			),
		);
	}
	
	/**
	* Checks if class is meta type
	*
	* Makes grid_reference_box a meta type
	*
	* @return boolean
	*/
	public function isMetaType() {
		return TRUE;
	}
	
	/**
	* Determines name of meta type that is shown in Grid menu
	*
	* @return string
	*/
	public function metaTitle() {
		return t("Reusable boxes");
	}
	
	/**
	* Criteria for meta search
	*
	* @return array
	*/
	public function metaSearchCriteria() {
		return array();
	}

	/**
	* Implements meta search
	*
	* @param string $criteria
	*
	* @param mixed $query
	*
	* @return array
	*/
	public function metaSearch($criteria,$query) {
		$ids=$this->storage->getReuseableBoxIds();
		$results=array();
		foreach($ids as $id)
		{
			$box=new grid_reference_box();
			$box->storage=$this->storage;
			$box->content->boxid=$id;
			$results[]=$box;
		}
		return $results;
	}
}
