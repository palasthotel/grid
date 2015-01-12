<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
 /**
* Includes STATIC CONTENT meta type, aka grid_static_box, and grid_static_base_box.
* grid_static_base_box extends grid_static_box
*/
/** 
* Meta type "STATIC CONTENT"
*
* Creates a new meta type used as category for boxes. 
*/
class grid_static_box extends grid_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'static';
	}
	
	/**
	* Checks if class is meta type
	*
	* Makes grid_static_box a meta type
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
		return t("Static content");
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
	* @return string[]
	*/
	public function metaSearch($criteria,$query) {
	    $result = array();
	    foreach (get_declared_classes() as $class) {
	        if (is_subclass_of($class, 'grid_static_box'))
	            $result[] = $class;
	    }
	    $return=array();
	    foreach($result as $class)
	    {
		    $instance=new $class();
		    $instance->storage=$this->storage;
		    $subresults=$instance->metaSearch($criteria,$query);
		    foreach($subresults as $subresult)
		    {
			    $return[]=$subresult;
		    }
	    }
	    return $return;

	}
	
	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure () {
		return array();
	}

}

/**
* Static-Base-Box is considered a static content.
*/
class grid_static_base_box extends grid_static_box {

	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'static_base';
	}
	
	/**
	* Box renders its menu label and renders its content in here.
	*
	* @param boolean $editmode
	*
	* @return void
	*/
	public function build($editmode) {
		
	}
	
	/**
	* Checks if lass is meta type
	*
	* Static-Base-Box is no meta type
	*
	* @return boolean
	*/
	public function isMetaType() {
		return FALSE;
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
		if(get_class($this)!=get_class())
			return array($this);
		return array();

	}
	
	/**
	* Determines editor widgets used in backend
	*
	* @return void
	*/
	public function contentStructure() {

	}
}