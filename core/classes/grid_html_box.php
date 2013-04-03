<?php

class grid_html_box extends grid_box {
	
	public function type()
	{
		return 'html';
	}

	public function build($editmode) {
		//boxes render their content in here
		return $this->content->html;
	}

}