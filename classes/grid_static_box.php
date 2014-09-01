<?php
// Metatype "STATIC CONTENT"
class grid_static_box extends grid_box {
	
	public function type() {
		// Sets box type
		return 'static';
	}
	
	public function isMetaType() {
		// Makes static_box a MetaType
		return TRUE;
	}
	
	public function metaTitle() {
		// Name of MetaType that is shown in Grid menu
		return t("Static content");
	}
	
	public function metaSearchCriteria() {
		// Criteria for meta search
		return array();
	}
	
	public function metaSearch($criteria,$query) {
		// Implements meta search
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
	
	public function contentStructure () {
		// Determines editor widgets used in backend
		return array();
	}

}

// Static-Base-Box is considered a static content.
class grid_static_base_box extends grid_static_box {

	public function type() {
		// Sets box type
		return 'static_base';
	}
	
	public function build($editmode) {
		// Box renders its content in here
		
	}
	
	public function isMetaType() {
		// List-Box is no MetaType
		return FALSE;
	}
	
	public function metaSearch($criteria,$query) {
		// Implements meta search
		if(get_class($this)!=get_class())
			return array($this);
		return array();

	}
	
	public function contentStructure() {
		// Determines editor widgets used in backend
		
	}
}