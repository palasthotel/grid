<?php
// Metatype "LISTS"
class grid_abstract_list_box extends grid_box {
	
	public function type() {
		// Sets box type
		return 'abstract_list';
	}

	public function build($editmode) {
	}
	
	public function isMetaType() {
		// Makes abstract_list_box a MetaType
		return TRUE;
	}
	
	public function metaTitle() {
		// Name of MetaType that is shown in Grid menu
		return t("Lists");
	}
	
	public function metaSearchCriteria() {
		// Criteria for meta search
		return array();
	}
	
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
		    $subresults=$instance->metaSearch($criteria,$search);
		    foreach($subresults as $subresult)
		    {
			    $return[]=$subresult;
		    }
	    }
	    return $return;
	}
	
	public function contentStructure () {
		// Determines editor widgets used in backend
		return array();
	}

}

// List-Box is considered an abstract list
class grid_list_box extends grid_abstract_list_box {
	
	public function type() {
		// Sets box type
		return 'list';
	}
	
	public function build($editmode) {
		
	}
	
	public function isMetaType() {
		// List-Box is no MetaType
		return FALSE;
	}
	
	public function metaSearch($criteria,$search) {
		// Implements meta search
		if(get_class($this)!=get_class())
			return array($this);
		return array();
	}
	
	public function contentStructure() {
		// Determines editor widgets used in backend
		return array();
	}
}