<?php

class grid_reference_box extends grid_box {

	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->boxid=-1;
	}
	
	public function type() {
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
		return array(
			array(
				'key'=>'boxid',
				'type'=>'hidden',
			),
		);
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return t("Reusable boxes");
	}
	
	public function metaSearchCriteria() {
		return array();
	}

	
	public function metaSearch($criteria,$query) 
	{
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
