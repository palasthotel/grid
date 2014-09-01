<?php
// HTML-Box contents is considered a static content
class grid_html_box extends grid_static_base_box {
	
	public function type() {
		// Sets box type
		return 'html';
	}

	public function __construct() {
		// Constructor initializes editor widgets
		$this->content=new Stdclass();
		$this->content->html='';
	}

	public function build($editmode) {
		if($editmode && empty($this->content->html)) {
			// Determines menu label of the box
			return t("Static HTML-Content");
		}
		else {
			// Box renders its content in here
			return $this->content->html;
		}
	}
	
	public function contentStructure () {
		// Determines editor widgets used in backend
		return array(
			array(
				'key'=>'html',
				'label'=>t('Text'),
				'type'=>'html'
			),
		);
	}

}
