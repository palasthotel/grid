<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

/** 
* Meta type "Configuration"
*
*/
class grid_structure_configuration_box extends grid_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'structure_configuration';
	}
	
	/**
	* Checks if class is meta type
	*
	* Makes grid_structure_configuration_box a meta type
	*
	* @return boolean
	*/
	public function isMetaType() {
		return count($this->metaSearch("","")) > 0;
	}
	
	/**
	* Determines name of meta type that is shown in Grid menu
	*
	* @return string
	*/
	public function metaTitle() {
		return t("Configurations");
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
			if (is_subclass_of($class, 'grid_structure_configuration_box'))
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
				/**
				 * @var \grid_structure_configuration_base_box $subresult
				 */
				$subresult->storage = $this->storage;
				if(count($subresult->contentStructure()) > 0){
					$return[]=$subresult;
				}
			}
		}
		return $return;

	}

}


/**
 * Static-Base-Box is considered a static content.
 */
class grid_structure_configuration_base_box extends grid_structure_configuration_box {

	/**
	 * Sets box type
	 *
	 * @return string
	 */
	public function type() {
		return 'structure_configuration_base';
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
	 * @return \grid_structure_configuration_base_box[]
	 */
	public function metaSearch($criteria,$query) {
		if(get_class($this)!=get_class())
			return array($this);
		return array();
	}

	public function contentStructure() {
		return $this->storage->fireHookAlter(
			\Grid\Constants\Hook::ALTER_CONFIGURATION_BOX_CONTENT_STRUCTURE,
			parent::contentStructure(),
			$this->type()
		);
	}

}
