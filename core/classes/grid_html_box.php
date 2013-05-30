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
			return "Statischer HTML-Inhalt";
		}
		else
		{
			$preWrap="";
			$postWrap="";
			if(isset($this->content->wrapDiv) && $this->content->wrapDiv)
			{
				$preWrap="<div>";
				$postWrap="</div>";
			}
			//boxes render their content in here
			return $preWrap.$this->content->html.$postWrap;
		}
	}
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'html',
				'type'=>'html'
			),
			array(
				'key'=>'wrapDiv',
				'type'=>'checkbox',
				'info'=>'Inhalt in Div wrappen'
			),
		);
	}

}
