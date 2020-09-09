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
use Grid\Constants\Hook;

class grid_box extends GridBase {

	/**
	* Contains id of boxes
	* @var integer
	*/
	public $boxid;

	/**
	* Reference to the Grid itself
	* @var grid_grid
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
	* Class constructor
	*/
	public function __construct() {
		$this->content=new stdClass();
	}

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
		$found=FALSE;
		$this->classes[] = "grid-box-".$this->type();
		$this->storage->fireHook(Hook::WILL_RENDER_BOX, (object)array("box" => $this, 'editmode'=>$editmode));
		ob_start();
		$typechecks=array();
		$class=get_class($this);
		$typechecks[]=preg_replace("/(?:grid_(.*)_box|grid_(box))/u", "$1$2", $class);
		while($class!=FALSE)
		{
			$class=get_parent_class($class);
			$typechecks[]=preg_replace("/(?:grid_(.*)_box|grid_(box))/u", "$1$2", $class);
		}
		foreach($typechecks as $type)
		{
			if(is_array($this->storage->templatesPaths))
			{
				foreach($this->storage->templatesPaths as $templatesPath) {
					$found=$this->renderTemplate($templatesPath, $editmode, $type);
					if($found) break;
				}
			}
			if(!$found)
			{
				$found = $this->renderTemplate($this->storage->templatesPath, $editmode, $type);
			}
			if(!$found)
			{
				$found=$this->renderTemplate(dirname(__FILE__).'/../templates/frontend',$editmode,$type);
			}
			if($found) break;
		}

		$output=ob_get_clean();
		$this->storage->fireHook(Hook::DID_RENDER_BOX, (object)array("box" => $this, 'editmode'=>$editmode));
		return $output;
	}

	/**
	 * includes tempalte content
	 * @param  String $templatesPath
	 * @param  boolean $editmode       
	 * @return boolean  found or not
	 */
	private function renderTemplate($templatesPath, $editmode, $type){
		$templatesPath = rtrim($templatesPath, "/");
		$found=FALSE;
		if($templatesPath!=NULL)
		{
			$editmode_file = $templatesPath.'/grid-box-'.$type.'-editmode.tpl.php';
			$file = $templatesPath.'/grid-box-'.$type.'.tpl.php';
			if($editmode && file_exists($editmode_file) )
			{
				$found=TRUE;
				$content=$this->build($editmode);
				$this->renderContent($content, $editmode_file);
			}
			if(!$editmode && file_exists($file))
			{
				$found=TRUE;
				$content=$this->build($editmode);
				$this->renderContent($content, $file);
			}
		}
		return $found;
	}

	/**
	 * renders content in template file
	 * @param $content
	 * @param $file_path
	 */
	private function renderContent($content, $file_path){
		include $file_path;
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
		$this->storage->fireHook( Hook::DELETE_BOX, $this );
		return $this->storage->deleteBox($this);
	}
	
	/** 
	* Refreshes box content.
	*
	* @return boolean
	*/
	public function updateBox($boxdata)	{
		$this->storage->fireHook( Hook::SAVE_BOX, (object)array("box" => $this, "data" => $boxdata) );
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
	 * @param $fid int file id
	 * @param $path string contentstructure
	 *
	 * @return boolean
	 */
	public function getFileInfo($fid,$path){
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
