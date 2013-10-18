<?php

class grid_html_box extends grid_static_base_box {
	
	public function type()
	{
		return 'html';
	}

	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->html='';
	}

	public function build($editmode) {
		if($editmode && empty($this->content->html))
		{
			return t("Static HTML-Content");
		}
		else
		{
			//boxes render their content in here
			return $this->content->html;
		}
	}
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'html',
				'label'=>t('Text'),
				'type'=>'html'
			),
		);
	}

}
