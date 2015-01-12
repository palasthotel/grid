<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/**
* Includes LISTS meta type, aka grid_abstract_list_box, and grid_list_box.
* grid_list_box extends grid_abstract_list_box
*/
/** 
* Meta type "LISTS"
*
* Creates a new meta type used as category for boxes. 
*/
class grid_abstract_list_box extends grid_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'abstract_list';
	}

	/**
	* Box renders its menu label and its content in here.
	*
	* @return void
	*/
	public function build($editmode) {
		
	}
	
	/**
	* Checks if class is meta type
	*
	* Makes abstract_list_box a meta type
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
		return t("Lists");
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
	* @param mixed $search
	*
	* @return string[]
	*/
	public function metaSearch($criteria,$search) {
	    $result = array();
	    foreach (get_declared_classes() as $class) {
	        if (is_subclass_of($class, 'grid_list_box'))
	            $result[] = $class;
	    }
	    $return=array();
	    foreach($result as $class)
	    {
		    $instance=new $class();
		    $instance->storage = $this->storage;
		    $subresults=$instance->metaSearch($criteria,$search);
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
* List-Box is considered an abstract list
*/
class grid_list_box extends grid_abstract_list_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'list';
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
	* List-Box is no meta type
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
	* @param mixed $search
	*
	* @return array
	*/
	public function metaSearch($criteria,$search) {
		if(get_class($this)!=get_class())
			return array($this);
		return array();
	}
	
	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure() {
		return array();
	}
}