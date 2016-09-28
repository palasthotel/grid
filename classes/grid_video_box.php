<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
 
/**
* Video-Box is considered a static content
*/
class grid_video_box extends grid_static_base_box
{
	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return "video";
	}

	/**
	* Class contructor
	*
	* Initializes editor widgets for backend
	*/
	public function __construct() {
		parent::__construct();
		$this->content->url='';
		$this->content->title = 0;
		$this->content->related=0;
		$this->content->html='';
	}

	/**
	* Box renders its menu label and renders its content in here.
	*
	* @param boolean $editmode
	*
	* @return string
	*/
	public function build($editmode) {
		if($editmode) {
			return $this->content;
		}
		else {
			return $this->content->html;
		}
	}
	
	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure() {
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

	/**
	* Persists function
	*
	* @return mixed
	*/
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
				$scheme=$result['scheme'];
				$url=$scheme."://www.youtube.com/oembed?url=".urlencode($this->content->url)."&format=json";
				$request=curl_init($url);
				curl_setopt($request,CURLOPT_RETURNTRANSFER,TRUE);
				curl_setopt($request,CURLOPT_HEADER,FALSE);
				$result=curl_exec($request);
				if($result===FALSE)
				{
					var_dump(curl_error($request));
					die();
				}
				curl_close($request);
				$result=json_decode($result);
				$html=$result->html;
				$html=str_replace("src=\"http://", "src=\"".$scheme."://", $html);
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
				$url = $this->content->url;
				if(strpos($url, "?") !== false){
					$url = explode("?",$url);
					$url = $url[0];
				}
				
				$parts = explode("/", $url);
				$scheme=$result['scheme'];
				$url=$result['scheme']."://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=".urlencode(end($parts))."&format=json";
				$request=curl_init($url);
				curl_setopt($request,CURLOPT_RETURNTRANSFER,TRUE);
				curl_setopt($request,CURLOPT_HEADER,FALSE);
				$result=curl_exec($request);
				curl_close($request);
				$result=json_decode($result);
				$html=$result->html;
				$html=str_replace("src=\"http://", "src=\"".$scheme."://", $html);
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

				$url=$result['scheme']."://vimeo.com/api/oembed.json?url=".urlencode($this->content->url).$url_need_title.$url_need_byline.$url_need_portrait;
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