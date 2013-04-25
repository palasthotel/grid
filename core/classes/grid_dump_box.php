<?php

class grid_dump_box extends grid_box {
	
	public function type()
	{
		return 'dump';
	}

	public function build($editmode) {
		return "me is dump!";
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Doofer Inhalt";
	}
	
	public function metaSearchCriteria() {
		return array("titel");
	}
	
	public function metaSearch($criteria,$query) {
		return array();
	}
	
	public function contentStructure () {
		return array(
		);
	}

}