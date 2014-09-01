<?php
// Metatype "REFERENCE"
class grid_reference_box extends grid_box {

	public function __construct() {
		// Constructor initializes editor widgets
		$this->content=new Stdclass();
		$this->content->boxid=-1;
	}
	
	public function type() {
		// Sets box type
		return 'reference';
	}

	public function build($editmode) {
		$box=$this->storage->loadReuseBox($this->content->boxid);
		return $box->build($editmode);
	}
	
	public function render($editmode) {
		$box=$this->storage->loadReuseBox($this->content->boxid);
		$box->classes=$this->classes;
		return $box->render($editmode);
	}
	
	public function contentStructure () {
		// Determines editor widgets used in backend
		return array(
			array(
				'key'=>'boxid',
				'type'=>'hidden',
			),
		);
	}
	
	public function isMetaType() {
		// Makes reference_box a MetaType
		return TRUE;
	}
	
	public function metaTitle() {
		// Name of MetaType that is shown in Grid menu
		return t("Reusable boxes");
	}
	
	public function metaSearchCriteria() {
		// Criteria for meta search
		return array();
	}

	
	public function metaSearch($criteria,$query) {
		// Implements meta search
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
