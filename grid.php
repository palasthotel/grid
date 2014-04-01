<?php

class grid_library
{
	public function __construct()
	{
		require("classes/bootstrap.php");
	}
	
	private function getHome()
	{
		return dirname(__FILE__)."/";
	}
	
	public function getFrontendCSS($absolute=FALSE)
	{
		$home=$this->getHome();
		$path=$home."css/default-frontend.css";
		if($absolute)
			return $path;
		$path=substr($path, strlen($home));
		return $path;
	}
	
	//Gets an array of JS files to include on editor view (if absolute is true, absolute paths are returned.
	public function getEditorJS($language="en",$absolute=FALSE)
	{
		$home=$this->getHome();
		$editorfields=glob($home."js/app/views/EditorWidgets/*.js");
		
		$editorwidgets=array();
		foreach($editorfields as $idx=>$file)
		{
			$path=$file;
			$editorwidgets[]=$path;
		}
		
		$framework_dir=$home."js/frameworks/";
		$app_dir=$home."js/app/";
		
		$scripts=array();
		$scripts[]=$framework_dir."jquery-1.8.3.min.js";
		$scripts[]=$framework_dir."jquery-ui-1.10.2.custom.js";
		$scripts[]=$framework_dir."jquery.iframe-transport.js";
		$scripts[]=$framework_dir."jquery.fileupload.js";
		$scripts[]=$framework_dir."underscore.js";
		$scripts[]=$framework_dir."GridBackbone.js";
		$scripts[]=$framework_dir."GridICanHaz.js";
		$scripts[]=$home."js/ckeditor/ckeditor.js";
		$scripts[]=$app_dir."GridViews.js";
		foreach($editorwidgets as $idx=>$path)
		{
			$scripts[]=$path;
		}
		$scripts[]=$app_dir."views/GridRevisionsView.js";
		$scripts[]=$app_dir."views/GridToolbarView.js";
		$scripts[]=$app_dir."views/GridToolContainersView.js";
		$scripts[]=$app_dir."views/GridToolBoxesView.js";
		$scripts[]=$app_dir."views/GridSlotStyleChangerView.js";
		$scripts[]=$app_dir."GridModels.js";
		$scripts[]=$app_dir."models/GridBoxBlueprint.js";
		$scripts[]=$app_dir."GridCollections.js";
		$scripts[]=$app_dir."collections/GridBoxBlueprints.js";
		$scripts[]=$app_dir."GridSync.js";
		$scripts[]=$app_dir."Grid.js";
		$scripts[]=$home."/js/language/grid-".$language.".js";
		
		if($absolute)
		{
			return $scripts;
		}
		$return=array();
		foreach($scripts as $idx=>$script)
		{
			$return[]=substr($script, strlen($home));
		}
		return $return;
	}
	
	//Gets an array of CSS files to include on editor view
	public function getEditorCSS($rtl=FALSE,$absolute=FALSE)
	{
		$css=array();
		$home=$this->getHome();
		$css[]=$home."css/font-opensans/font.css";
		//$css[]=$home."css/font-icons/css/grid.css";
		$css[]=$home."css/font-icons/entypo.css";
		$css[]=$home."css/font-icons/css/animation.css";
		$css[]=$home."css/grid-backend.css";
		if($rtl)
		{
			$css[]=$home."css/rtl.css";
		}
		if($absolute)
		{
			return $css;
		}
		$return=array();
		foreach($css as $idx=>$entry)
		{
			$tmp=substr($entry, strlen($home));
			$return[]=$tmp;
		}
		return $return;
	}
	
	//renders the CKEditor configuration
	public function getCKEditorConfig($styles,$formats)
	{
		ob_start();
		require("js/grid_htmlbox_ckeditor_config.js.php");
		$str=ob_get_contents();
		ob_end_clean();
		return $str;
	}
	
	/*
	 * Returns the Editor HTML. 
	 * params:
	 * grid_id: id of the grid to edit
	 * grid_mode: grid or box or container.
	 * pathToCKEditorConfig: url which returns the output of renderCKEditorConfig
	 * ajaxendpoint: url which connects to the ajax endpoint class
	 * debug mode: true or false
	 * preview_url: url to preview the current grid
	 * preview_pattern: pattern for previews of certain 
	 */
	public function getEditorHTML($grid_id,$grid_mode,$pathToCKEditorConfig,$ajaxendpoint,$debug_mode,$preview_url,$preview_pattern)
	{
		ob_start();
		require("templates/backend/grid.tpl.php");
		$str=ob_get_contents();
		ob_end_clean();
		return $str;
	}
}