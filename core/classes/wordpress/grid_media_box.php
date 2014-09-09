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
		$this->content = new StdClass();
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
		if ( isset( $this->content->fileid->id ) && $this->content->fileid->id != '' ) {
			$a_pre = '';
			$a_post = '';
			if ( isset( $this->content->url ) && $this->content->url != '' ) {
				$a_pre = '<a href="'.$this->content->url.'">';
				$a_post = '</a>';
			}
			if( $editmode ) {
				$metadata = wp_get_attachment_metadata( $this->content->fileid->id );
				if ( is_array( $metadata ) && isset( $metadata['file'] ) ) {
					$a_post .= ' ('.$metadata['file'].')';
				} else {
					$a_post .= json_encode( $this->content->fileid->sizes->{$this->content->fileid->size}->url );
					$a_post .= ' ('.$this->content->fileid->id.')';
				}
			}
			$img_tag = wp_get_attachment_image( $this->content->fileid->id, $this->content->fileid->size );
			if( ( !$img_tag || $img_tag == '') && !$editmode && is_object( $this->content->fileid ) ) {
				$img_tag = '<img src="'.$this->content->fileid->sizes->{$this->content->fileid->size}->url. '"/>';
			}
			return $a_pre.$img_tag.$a_post;
		}
		return 'Media-Box';
	}

	/**
	* Determines editor widgets used in backend
	*
	* @return array
	*/
	public function contentStructure () {
		$value = get_option( 'grid_mediaselect_info', '' );
		$cs = array();
		$cs[] = array(
				'key' => 'fileid',
				'type' => 'wp-mediaselect',
				'label' => t( 'Image' ),
				);
				if ($value != '') {
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
