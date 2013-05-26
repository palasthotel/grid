<?php

class grid_html_box extends grid_box {
	
	public function type()
	{
		return 'html';
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
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Statischer Inhalt";
	}
	
	public function metaSearchCriteria() {
		return array();
	}
	
	public function metaSearch($criteria,$query) {
		$this->content=new stdClass();
		$this->content->html="";
		$this->content->wrapDiv=FALSE;
		return array($this);
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