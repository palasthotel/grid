<?php
// Grid-Box is parent to all Grid boxes
class grid_box extends grid_base {
	public $boxid;
	public $grid;
	public $style; // Defines the style of boxes
	public $classes=array();
	public $title; // Title of the box
	public $titleurl; // Optional link on box title
	public $readmore; // Defines read more text
	public $readmoreurl; // Optional link to read more
	public $prolog; // Prolog textarea
	public $epilog; // Epilog textarea
	public $layout;
	public $language;
	public $content; // Main content textarea

	public function type() {
		// Sets box type
		return 'box';
	}

	public function build($editmode) {
		// Box renders its content in here
		return '';
	}
	
	public function render($editmode) {
		$content=$this->build($editmode);
		ob_start();
		$found=FALSE;
		$this->classes[] = "grid-box-".$this->type();
		if($this->storage->templatesPath!=NULL)
		{
			if(file_exists($this->storage->templatesPath.'/grid-box-'.$this->type().'.tpl.php'))
			{
				$found=TRUE;
				include $this->storage->templatesPath.'/grid-box-'.$this->type().'.tpl.php';
			}
			else if(file_exists($this->storage->templatesPath.'/grid-box-box.tpl.php'))
			{
				$found=TRUE;
				include $this->storage->templatesPath.'/grid-box-box.tpl.php';
			}
		}
		if(!$found)
		{
			if(file_exists(dirname(__FILE__).'/../templates/frontend/grid-box-'.$this->type().'.tpl.php'))
				include dirname(__FILE__).'/../templates/frontend/grid-box-'.$this->type().'.tpl.php';
			else
				include dirname(__FILE__).'/../templates/frontend/grid-box-box.tpl.php';
		}
		$output=ob_get_clean();
		return $output;
	}
	
	public function isMetaType() {
		// Makes grid_box a MetaType
		return FALSE;
	}
	
	public function metaTitle() {
		// Name of MetaType that is shown in Grid menu
		return NULL;
	}
	
	public function metaSearchCriteria() {
		// Criteria for meta search
		return array();
	}
	
	public function metaSearch($criteria,$query) {
		// Implements meta search
		return array();
	}
	
	public function contentStructure () {
		// Determines editor widgets used in backend
		return array();
	}
	
	public function persist() {
		return $this->storage->persistBox($this);
	}
	
	public function delete() {
		// Delete function
		return $this->storage->deleteBox($this);
	}
	
	public function updateBox($boxdata)	{
		// Refreshes box content
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
	
	public function performElementSearch($key,$query) {
		// Implements search for keys
		return array(array('key'=>-1,'value'=>'This box seems not to implement search'));
	}
	
	public function getElementValue($path,$id) {
		// Gets values for element search
		return "BOX DOESNT SUPPORT THIS";
	}
	
	public function performFileUpload($key,$path,$original_file) {
		// array('result'=>FALSE,'error'=>'wrong box');
		return FALSE;
	}
	
	public function prepareReuseDeletion()
	{
		
	}
	
}
