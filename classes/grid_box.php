<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/**
* Grid-Box is parent to all Grid boxes.
*/
class grid_box extends grid_base {

	/**
	* Contains id of boxes
	* @var integer
	*/
	public $boxid;

	/**
	* Reference to the Grid itself
	* @obj Grid
	*/
	public $grid;

	/**
	* Defines the style of boxes
	* @var string
	*/
	public $style;

	/**
	* Contains all class names
	* @var array
	*/
	public $classes=array();

	/**
	* Contains title of the box
	* @var string
	*/
	public $title;
	
	/**
	* Sets an optional link for box title
	* @var string
	*/
	public $titleurl;

	/**
	* Determines read more text
	* @var string
	*/
	public $readmore;

	/**
	* Sets an optional link for readmore
	* @var string
	*/
	public $readmoreurl;

	/**
	* Contains prolog content
	* @var string
	*/
	public $prolog;

	/**
	* Contains epilog content
	* @var string
	*/
	public $epilog;

	/**
	* Describes used box layout
	* @var string
	*/
	public $layout;

	/**
	* Sets used box language property
	* @var string
	*/
	public $language;

	/**
	* Represents all content determined by contentStructure
	* @var string
	*/
	public $content;

	/**
	* Sets box type.
	*
	* @return string
	*/
	public function type() {
		return 'box';
	}

	/**
	* Box renders its content here.
	*
	* @param boolean $editmode checks if box is in editmode or frontend.
	*
	* @return string
	*/
	public function build($editmode) {
		return '';
	}
	
	/**
	* Box renders itself here.
	*
	* @param boolean $editmode
	*
	* @return mixed
	*/
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
	
	/**
	* Checks if class is meta type
	*
	* Makes grid_box a MetaType.
	*
	* @return boolean
	*/
	public function isMetaType() {
		return FALSE;
	}
	
	/**
	* Sets name of MetaType that is shown in Grid menu.
	*
	* @return null
	*/
	public function metaTitle() {
		return NULL;
	}
	
	/**
	* Determines criteria for meta search.
	*
	* @return array
	*/
	public function metaSearchCriteria() {
		return array();
	}
	
	/**
	* Implements meta search.
	*
	* @return array
	*/
	public function metaSearch($criteria,$query) {
		return array();
	}
	
	/**
	* Determines editor widgets used in backend.
	*
	* @return array
	*/
	public function contentStructure () {
		return array();
	}
	
	/**
	* Persists function
	*
	* @return mixed
	*/
	public function persist() {
		return $this->storage->persistBox($this);
	}
	
	/**
	* Delete function.
	*
	* @return boolean
	*/
	public function delete() {
		return $this->storage->deleteBox($this);
	}
	
	/** 
	* Refreshes box content.
	*
	* @return boolean
	*/
	public function updateBox($boxdata)	{
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
	
	/**
	* Implements search for keys.
	*
	* @return array
	*/
	public function performElementSearch($key,$query) {
		return array(array('key'=>-1,'value'=>'This box seems not to implement search'));
	}
	
	/**
	* Gets values for element search.
	*
	* @return string
	*/
	public function getElementValue($path,$id) {
		return "BOX DOESNT SUPPORT THIS";
	}
	
	/**
	* File upload function
	*
	* @uses array array('result'=>FALSE,'error'=>'wrong box');
	*
	* @return boolean
	*/
	public function performFileUpload($key,$path,$original_file) {
		return FALSE;
	}
	
	/**
	* Initializes deletion of reuse box
	*
	* @return void
	*/
	public function prepareReuseDeletion()
	{
		
	}
	
}
