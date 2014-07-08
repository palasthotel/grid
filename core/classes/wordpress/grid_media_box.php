<?php

class grid_media_box extends grid_static_base_box {

	public function __construct() {
		$this->content=new StdClass();
		$this->content->fileid=new StdClass();
		$this->content->fileid->id='';
		$this->content->fileid->size='';
		$this->content->url = '';
	}
	
	public function type() {
		return 'media';
	}

	public function build($editmode) {
		//boxes render their content in here
		if(isset($this->content->fileid->id) && $this->content->fileid->id!='') {
			$a_pre = '';
			$a_post = '';
			if(isset($this->content->url) && $this->content->url != '') {
				$a_pre = '<a href="'.$this->content->url.'">';
				$a_post = '</a>';
			}
			if($editmode) {
				$metadata=wp_get_attachment_metadata($this->content->fileid->id);
				if(is_array($metadata) && isset($metadata['file'])) {
					$a_post.=' ('.$metadata['file'].')';
				} else {
					$a_post.= json_encode( $this->content->fileid->sizes->{$this->content->fileid->size}->url );
					$a_post.= ' ('.$this->content->fileid->id.')';
				}
			}
			$img_tag = wp_get_attachment_image($this->content->fileid->id,$this->content->fileid->size);
			if( ( !$img_tag || $img_tag == '') && !$editmode && is_object($this->content->fileid) ) {
				$img_tag = '<img src="'.$this->content->fileid->sizes->{$this->content->fileid->size}->url. '"/>';
			}
			return $a_pre.$img_tag.$a_post;
		}
		return 'Media-Box';
	}


	public function contentStructure () {
		return array(
			array(
				'key'=>'fileid',
				'type'=>'wp-mediaselect',
				'label'=>t('Image'),
			),
			array(
				'key' => 'url',
				'type' => 'text',
				'label' => t('Hyperlink-URL (optional)'),
			),
		);
	}
}
