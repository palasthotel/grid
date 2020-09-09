<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */
/**
* Media-Box is considered as static content
*/
class grid_media_box extends grid_static_base_box {

	/**
	* Class contructor
	*
	* Initializes editor widgets for backend
	*/
	public function __construct() {
		parent::__construct();
		$this->content->fileid = new StdClass();
		$this->content->fileid->id = '';
		$this->content->fileid->size = '';
		$this->content->url = '';
		$this->content->fileinfo = ' ';
	}

	/**
	* Sets box type
	*
	* @return string
	*/
	public function type() {
		return 'media';
	}

	/**
	* Box renders its menu label and renders its content in here.
	*
	* @param boolean $editmode
	*
	* @return mixed
	*/
	public function build( $editmode ) {
		$this->content->image_tag = '';
		$this->content->image_url = '';
		$this->content->image_mega_file = '';
		if ( isset( $this->content->fileid->id ) && $this->content->fileid->id != '' ) {
			$this->content->image_url = $this->content->fileid->sizes->{$this->content->fileid->size}->url;
			$a_pre = '';
			$a_post = '';
			if ( isset( $this->content->url ) && $this->content->url != '' ) {
				if(!$editmode){
					$a_pre = '<a href="'.$this->content->url.'">';
					$a_post = '</a>';
				} else{
					$a_post.= '<br/>'.$this->content->url;
				}

			}
			if ( $editmode ) {
				$metadata = wp_get_attachment_metadata( $this->content->fileid->id );
				if ( is_array( $metadata ) && isset( $metadata['file'] ) ) {
					$this->content->image_meta_file = $metadata['file'];
					$a_post .= '<br/> ('.$metadata['file'].')';
				} else {
					$a_post .= json_encode( $this->content->image_url );
					$a_post .= '<br/> ('.$this->content->fileid->id.')';
				}
			}
			$img_tag = wp_get_attachment_image( $this->content->fileid->id, $this->content->fileid->size );
			if ( ( ! $img_tag || $img_tag == '') && ! $editmode && is_object( $this->content->fileid ) ) {
				$img_tag = '<img src="'.$this->content->image_url. '"/>';
			}
			$this->content->image_tag = $img_tag;
			$this->content->rendered_html = $a_pre.$img_tag.$a_post;
			return $this->content;
		}
		$this->content->rendered_html = ($editmode || WP_DEBUG) ? 'Media-Box': '';
		return $this->content;
	}

	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure () {
		$value = get_option( 'grid_mediaselect_info', '' );
		$cs = parent::contentStructure();
		$cs[] = array(
			'key' => 'fileid',
			'type' => 'wp-mediaselect',
			'label' => t( 'Image' ),
			'media_type' => get_option( 'grid_mediaselect_types', 'image' ),
		);
		if ( $value != '' ) {
			$cs[] = array(
				'key' => 'fileinfo',
				'type' => 'info',
				'text' => $value,
			);
		}
		$cs[] = array(
			'key' => 'url',
			'type' => 'text',
			'label' => t( 'Hyperlink-URL (optional)' ),
		);
		return $cs;
	}
}
