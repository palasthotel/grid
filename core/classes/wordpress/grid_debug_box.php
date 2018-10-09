<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */
/**
* Media-Box is considered as static content
*/
class grid_debug_box extends grid_static_base_box {

	/**
	* Class constructor
	*
	* Initializes editor widgets for backend
	*/
	public function __construct() {
		parent::__construct();
		$this->content->fileid = new StdClass();
	}

	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'debug';
	}

	/**
	* Box renders its menu label and renders its content in here.
	*
	* @param boolean $editmode
	*
	* @return mixed
	*/
	public function build( $editmode ) {
		return $this->content;
	}

	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure () {
		$cs = parent::contentStructure();

		$cs[] = array(
			'key' => 'list',
			'label' => 'This is a list element',
			'type' => 'list',
			'contentstructure' => array(
				array(
					"key"=>"text",
					"label"=> "This is a text element.",
					"type" => "text",
				),
				array(
					"key"=>"number",
					"label"=> "This is a number element.",
					"type" => "number",
				),
				array(
					"key"=>"input",
					"label" => "This is a generic input element.",
					'type' => 'input',
					'inputType' => 'date',
				),
				array(
					"key"=>"textarea",
					"label"=> "This is a textarea element.",
					"type" => "textarea",
				),
				array(
					"key"=>"checkbox",
					"label"=> "This is a checkbox element.",
					"type" => "checkbox",
				),
				array(
					"key"=>"select",
					"label"=> "This is a selection element.",
					"type" => "select",
					"selections" => array(
						array(
							"key" => 0, "text" => "First",
						),
						array(
							"key" => 1, "text" => "Second",
						),
						array(
							"key" => 1, "text" => "Third",
						),
					),
				),
				array(
					"key"=>"html",
					"label"=> "This is a wysiwyg element.",
					"type" => "html",
				),
				array(
					"key"=>"autocomplete",
					"label"=> "This is an autocompletion element.",
					"type" => "autocomplete",
				),
				array(
					"key"=>"autocomplete_with_links",
					"label"=> "This is an autocompletion element with links.",
					"type" => "autocomplete-with-links",
					"emptyurl" => "https://palasthotel.de/",
					"emptylinktext" => "No autocompletion value",
					"url" => "https://digitale-pracht.de/%",
					"linktext" => "Value exists"
				),
				array(
					"key"=>"multi_autocomplete",
					"label"=> "This is an multi-autocompletion element.",
					"type" => "multi-autocomplete",
				),
				array(
					'key' => 'media',
					'type' => 'wp-mediaselect',
					'label' => t( 'This is a wp media element' ),
					'media_type' => get_option( 'grid_mediaselect_types', 'image' ),
				),
				array(
					'key' => 'info',
					'type' => 'info',
					'text' => 'This is a information element.',
				),
				array(
					"key"=>"hidden",
					"type" => "hidden",
				),
			)
		);

		return $cs;
	}

	public function performElementSearch($key,$query){
      return array(
	      array('key'=>0,'value'=>'Result one'),
	      array('key'=>1,'value'=>'Result two')
      );
	}
	public function getElementValue($key,$id){
		if($id == null) return '';
		return "DEBUG";
	}
}
