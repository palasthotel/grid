<?php

class grid_abstract_list_box extends grid_box {
	
	public function type()
	{
		return 'abstract_list';
	}

	public function build($editmode) {
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Listen";
	}
	
	public function metaSearchCriteria() {
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
		return array();
	}

}

class grid_list_box extends grid_abstract_list_box {
	
	public function type()
	{
		return 'list';
	}
	
	public function build($editmode) {
		
	}
	
	public function isMetaType() {
		return FALSE;
	}
	
	public function metaSearch($criteria,$search) {
		if(get_class($this)!=get_class())
			return array($this);
		return array();
	}
	
	public function contentStructure() {
		return array();
	}
}