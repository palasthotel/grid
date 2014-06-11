<?php

class grid_soundcloud_box extends grid_static_base_box {
	
	public function type()
	{
		return 'soundcloud';
	}

	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->url= "";
		$this->content->color = "";
	}

	public function build($editmode) {
		if($editmode)
		{
			return t("Soundcloud").": ".$this->content->url;
		}
		else
		{

			$url = "http://soundcloud.com/oembed?";
			$url.= "url=".$this->content->url."&format=json&maxheight=300";
			if($this->content->color != "" && strlen($this->content->color) == 6) $url.= "&color=".$this->content->color;


			$curl = curl_init($url);
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
		    $return = curl_exec($curl);
		    curl_close($curl);

		    if($return== " " || !$return || $this->content->url == ""){
				return "<p>".t("no track found")."</p>";
			}

			$json = json_decode($return);
			return $json->html;
		}
	}
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'url',
				'label'=>t('URL'),
				'type'=>'text'
			),
			array(
				'key'=>'color',
				'label'=>t('Hex Color #[...] (optional)'),
				'type'=>'text'
			),
		);
	}

}
