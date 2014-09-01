<?php
// Video-Box is considered a static content
class grid_video_box extends grid_static_base_box
{
	public function type() {
		// Sets box type
		return "video";
	}

	public function __construct() {
		// Constructor initializes editor widgets
		$this->content=new Stdclass();
		$this->content->url='';
		$this->content->title = 0;
		$this->content->related=0;
		$this->content->html='';
	}

	public function build($editmode) {
		if($editmode) {
			// Determines menu label of the box
			return t("Video-box");
		}
		else {
			// Box renders its content in here
			return $this->content->html;
		}
	}

	public function contentStructure() {
		// Determines editor widgets used in backend
		return array(
			array(
				'key'=>'url',
				'label'=>t('Video-URL'),
				'type'=>'text',
			),
			array(
				'key'=>'title',
				'label' => t('Display title'),
				'type'=>'checkbox',
			),
			array(
				'key'=>'related',
				'label'=>t('Display related videos at the end (YouTube)'),
				'type'=>'checkbox',
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
			// OK, we have an url, we need to do our oembed vodoo.
			$result=parse_url($this->content->url);
			if(preg_match("/\w*?\.youtube\./um", $result['host']))
			{
				$url_show_info = "&showinfo=";
				if($this->content->title){
					$url_show_info.="1";
				} else {
					$url_show_info.="0";
				}
				$url_related = "&rel=";
				if($this->content->related){
					$url_related.="1";
				} else {
					$url_related.="0";
				}
				$url="http://www.youtube.com/oembed?url=".urlencode($this->content->url)."&format=json";
				$request=curl_init($url);
				curl_setopt($request,CURLOPT_RETURNTRANSFER,TRUE);
				curl_setopt($request,CURLOPT_HEADER,FALSE);
				$result=curl_exec($request);
				curl_close($request);
				$result=json_decode($result);
				$html=$result->html;
				// Prevents flash bug in Firefox (no playback on click)
				$html=str_replace('feature=oembed', 'feature=oembed&wmode=transparent&html5=1'.$url_related.$url_show_info, $html);
				$this->content->html=$html;
			}
			else if(preg_match("/youtu\.be/um", $result['host']) ) {
				$url_show_info = "&showinfo=";
				if($this->content->title){
					$url_show_info.="1";
				} else {
					$url_show_info.="0";
				}
				$url_related = "&rel=";
				if($this->content->related){
					$url_related.="1";
				} else {
					$url_related.="0";
				}
				$parts = explode("/", $this->content->url);
				$url="http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=".urlencode(end($parts))."&format=json";
				$request=curl_init($url);
				curl_setopt($request,CURLOPT_RETURNTRANSFER,TRUE);
				curl_setopt($request,CURLOPT_HEADER,FALSE);
				$result=curl_exec($request);
				curl_close($request);
				$result=json_decode($result);
				$html=$result->html;
				// Prevents flash bug in Firefox (no playback on click)
				$html=str_replace('feature=oembed', 'feature=oembed&wmode=transparent&html5=1'.$url_related.$url_show_info, $html);
				$this->content->html=$html;
			}
			else if(preg_match("/(\w*?\.)?vimeo\./um", $result['host']))
			{
				$url_need_title = "&title=";
				$url_need_byline = "&byline=";
				$url_need_portrait = "&portrait=";
				if($this->content->title){
					$url_need_title.="true";
					$url_need_byline.="true";
					$url_need_portrait.="true";
				} else {
					$url_need_title.="false";
					$url_need_byline.="false";
					$url_need_portrait.="false";
				}

				$url="http://vimeo.com/api/oembed.json?url=".urlencode($this->content->url).$url_need_title.$url_need_byline.$url_need_portrait;
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