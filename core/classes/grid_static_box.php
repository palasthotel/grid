<?php

class grid_static_box extends grid_box {
	
	public function type()
	{
		return 'static';
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Statischer Inhalt";
	}
	
	public function metaSearchCriteria() {
		return array();
	}
	
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
	
	public function contentStructure () {
		return array();
	}

}

class grid_static_base_box extends grid_static_box {

	public function type()
	{
		return 'static_base';
	}
	
	public function build()
	{
		
	}
	
	public function isMetaType() {
		return FALSE;
	}
	
	public function metaSearch($criteria,$query)
	{
		if(get_class($this)!=get_class())
			return array($this);
		return array();

	}
	
	public function contentStructure() {
		
	}
}