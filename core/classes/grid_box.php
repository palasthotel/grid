<?php

class grid_box extends grid_base {
	public $boxid;
	public $grid;
	public $style; // Define the Style of Boxes
	public $title;
	public $titleurl;
	public $readmore;
	public $readmoreurl;
	public $prolog;
	public $epilog;
	public $layout;
	public $language;
	public $content;

	public function type() {
		return 'box';
	}

	public function build($editmode) {
		//boxes render their content in here
		return '';
	}
	
	public function render($editmode) {
		$content=$this->build($editmode);
		ob_start();
		$found=FALSE;
		if($this->storage->templatesPath!=NULL)
		{
			if(file_exists($this->storage->templatesPath.'/box-'.$this->type().'.tpl.php'))
			{
				$found=TRUE;
				include $this->storage->templatesPath.'/box-'.$this->type().'.tpl.php';
			}
			else if(file_exists($this->storage->templatesPath.'/box-box.tpl.php'))
			{
				$found=TRUE;
				include $this->storage->templatesPath.'/box-box.tpl.php';
			}
		}
		if(!$found)
		{
			if(file_exists(dirname(__FILE__).'/../templates/box-'.$this->type().'.tpl.php'))
				include dirname(__FILE__).'/../templates/box-'.$this->type().'.tpl.php';
			else
				include dirname(__FILE__).'/../templates/box-box.tpl.php';
		}
		$output=ob_get_clean();
		return $output;
	}
	
	public function isMetaType() {
		return FALSE;
	}
	
	public function metaTitle() {
		return NULL;
	}
	
	public function metaSearchCriteria() {
		return array();
	}
	
	public function metaSearch($criteria,$query) {
		return array();
	}
	
	public function contentStructure () {
		return array();
	}
	
	public function persist() {
		return $this->storage->persistBox($this);
	}
	
	public function delete() {
		return $this->storage->deleteBox($this);
	}
	
	public function updateBox($boxdata)
	{
		$this->style=$boxdata->style;
		$this->title=$boxdata->title;
		$this->titleurl=$boxdata->titleurl;
		$this->readmore=$boxdata->readmore;
		$this->readmoreurl=$boxdata->readmoreurl;
		$this->prolog=$boxdata->prolog;
		$this->epilog=$boxdata->epilog;
		$this->content=$boxdata->content;
		return $this->persist();
	}
	
	public function performElementSearch($key,$query)
	{
		return array(array('key'=>-1,'value'=>'This box seems not to implement search'));
	}
	
	public function getElementValue($path,$id)
	{
		return "BOX DOESNT SUPPORT THIS";
	}
	
	public function performFileUpload($key,$path)
	{
		return FALSE;//array('result'=>FALSE,'error'=>'wrong box');
	}
	
	public function prepareReuseDeletion()
	{
		
	}
	
}
