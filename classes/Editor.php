<?php


namespace Palasthotel\Grid;


use Grid\Constants\GridCSSVariant;
use Grid\Constants\GridCssVariantFlexbox;
use Grid\Constants\GridCssVariantNone;
use Grid\Constants\GridCssVariantTable;

/**
 * @property Storage $storage
 */
class Editor {

	public function __construct(Storage $storage){
		$this->storage = $storage;
	}

	private function getHome()
	{
		return dirname(__FILE__)."/";
	}

	public function getFrontendCSS($absolute=FALSE)
	{
		$home=$this->getHome();
		$path=$home."css/grid-container-slots.css.php";
		if($absolute)
			return $path;
		$path=substr($path, strlen($home));
		return $path;
	}

	//Gets an array of JS files to include on editor view (if absolute is true, absolute paths are returned.
	public function getEditorJS($language="en",$absolute=FALSE, $need_jquery = TRUE)
	{
		$home=$this->getHome();
		$scripts = [
			$home."/dist/grid-editor"
		];

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

	/**
	 * @param object[] $container_types
	 * @param null|GridCSSVariant $variant
	 *
	 * @return string
	 */
	public function getContainerSlotCSS($container_types, $variant = null){

		header('Content-Type: text/css');
		if(null == $variant || $variant instanceof GridCssVariantNone) return "";

		ob_start();
		if( $variant instanceof GridCssVariantTable)	require $this->getHome() . "css/grid-frontend/table.css.php";
		if($variant instanceof GridCssVariantFlexbox)	require $this->getHome()."css/grid-frontend/flexbox.css.php";
		$return = ob_get_contents();
		ob_end_clean();

		return $return;
	}
	private function calculateSpace($space){
		if($space == null || $space == "") return null;
		$calc = explode("d", $space);
		if(count($calc) < 2) return null;
		return ($calc[0]/$calc[1])*100;
	}

	//renders the CKEditor configuration
	public function getCKEditorConfig($styles,$formats, $ckeditor_plugins = array())
	{
		ob_start();
		require($this->getHome()."js/grid_htmlbox_ckeditor_config.js.php");
		$str=ob_get_contents();
		ob_end_clean();
		return $str;
	}

	/**
	 * Returns the Editor HTML.
	 * @param $grid_id id of the grid to edit
	 * @param $grid_mode grid or box or container.
	 * @param $pathToCKEditorConfig url which returns the output of renderCKEditorConfig
	 * @param $ajaxendpoint url which connects to the ajax endpoint class
	 * @param $debug_mode true or false
	 * @param $preview_url url to preview the current grid
	 * @param $preview_pattern pattern for previews of certain
	 * @param string $async_service
	 * @param string $async_domain
	 * @param string $async_author
	 * @param string $async_path
	 * @param int $timeout for author grid lock in seconds (default is 5 minutes)
	 * @return string
	 */
	public function getEditorHTML($grid_id, $grid_mode, $pathToCKEditorConfig, $ajaxendpoint, $debug_mode, $preview_url, $preview_pattern, $async_service="", $async_domain="", $async_author="", $async_path="", $async_timeout = 300)
	{
		ob_start();
		require( dirname(__FILE__)."/templates/backend/grid.tpl.php" );
		$str=ob_get_contents();
		ob_end_clean();
		return $str;
	}


	public function getStyleEditor()
	{
		return new StyleEditor();
	}

	public function getReuseContainerEditor()
	{
		require_once(dirname(__FILE__)."/classes/grid_reuse_container_editor.php");
		return new ReuseContainerEditor();
	}

	public function getReuseBoxEditor()
	{
		require_once(dirname(__FILE__)."/classes/grid_reuse_box_editor.php");
		return new grid_reuse_box_editor();
	}

	public function getContainerEditor()
	{
		require_once(dirname(__FILE__)."/classes/grid_container_editor.php");
		return new ContainerEditor();
	}
}