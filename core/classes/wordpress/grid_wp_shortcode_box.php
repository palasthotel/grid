<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/**
* HTML-Box contents is considered a static content.
*/
class grid_wp_shortcode_box extends grid_static_base_box {
	
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'wp_shortcode';
	}
	
	function __construct() {
		parent::__construct();
		
		$this->content->slug = "";
		$this->content->attributes = array();
		
	}
	
	/**
	* Box determins its menu label and renders its content in here.
	*
	* @param boolean $editmode
	*
	* @return string
	*/
	public function build($editmode) {
		$slug = "";
		if(!empty($this->content->slug)) {
			$slug = $this->content->slug;
		}
		
		$attributes = array();
		foreach ($this->content->attributes as $attr){
			$attributes[] = "{$attr->name}=\"{$attr->value}\"";
		}
		
		$attributes_string = implode(" ", $attributes);
		
		if($editmode) {
			return (object) array(
				"slug" => $slug,
				"attributes" => $attributes_string,
			);
		}
		
		return do_shortcode("[{$slug} {$attributes_string}]");
		
	}
	
	function contentStructure(){
		$cs = parent::contentStructure();
		
		$cs[] = array(
			'key' => 'slug',
			'type' => 'text',
			'label' => __('Shortcode'),
		);
		
		$cs[] = array(
			'key' => 'attributes',
			'label' => __('Attributes'),
			'type' => 'list',
			'contentstructure' => array(
				array(
					'key' => 'name',
					'type' => 'text',
					'label' => __('Name'),
				),
				array(
					'key' => 'value',
					'type' => 'text',
					'label' => __('Value'),
				)
			),
		);
		
		return $cs;
	}
	
}
