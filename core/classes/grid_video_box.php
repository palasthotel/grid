<?php

class grid_video_box extends grid_static_base_box
{
	public function type()
	{
		return "video";
	}

	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->url='';
		$this->content->html='';
	}

	public function build($editmode)
	{
		if($editmode)
		{
			return "Video Box";
		}
		else
		{
			return $this->content->html;
		}
	}

	public function contentStructure()
	{
		return array(
			array(
				'key'=>'url',
				'label'=>'Video-URL',
				'type'=>'text',
			),
			array(
				'key'=>'html',
				'type'=>'hidden',
			),
		);
	}

	public function persist()
	{
		if(isset($this->content->url) && !empty($this->content->url))
		{
			//ok, we have an url, we need to do our oembed vodoo.
			$result=parse_url($this->content->url);
			if(preg_match("/\w*?\.youtube\./um", $result['host']))
			{
				$url="http://www.youtube.com/oembed?url=".urlencode($this->content->url)."&format=json";
				$request=curl_init($url);
				curl_setopt($request,CURLOPT_RETURNTRANSFER,TRUE);
				curl_setopt($request,CURLOPT_HEADER,FALSE);
				$result=curl_exec($request);
				curl_close($request);
				$result=json_decode($result);
				$html=$result->html;
				// prevents flash bug in Firefox (no playback on click)
				$html=str_replace('feature=oembed', 'feature=oembed&wmode=transparent&html5=1', $html);
				$this->content->html=$html;
			}
			else if(preg_match("/youtu\.be/um", $result['host']) )
			{
				$parts = explode("/", $this->content->url);
				$url="http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=".urlencode(end($parts))."&format=json";
				$request=curl_init($url);
				curl_setopt($request,CURLOPT_RETURNTRANSFER,TRUE);
				curl_setopt($request,CURLOPT_HEADER,FALSE);
				$result=curl_exec($request);
				curl_close($request);
				$result=json_decode($result);
				$html=$result->html;
				// prevents flash bug in Firefox (no playback on click)
				$html=str_replace('feature=oembed', 'feature=oembed&wmode=transparent&html5=1', $html);
				$this->content->html=$html;
			}
			else if(preg_match("/(\w*?\.)?vimeo\./um", $result['host']))
			{
				$url="http://vimeo.com/api/oembed.json?url=".urlencode($this->content->url);
				$request=curl_init($url);
				curl_setopt($request,CURLOPT_RETURNTRANSFER,TRUE);
				curl_setopt($request, CURLOPT_HEADER, FALSE);
				$result=curl_exec($request);
				curl_close($request);
				$result=json_decode($result);
				$this->content->html=$result->html;
			}
			else $this->content->html=$result['host'];
		}
		return parent::persist();
	}
}