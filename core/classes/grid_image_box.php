<?php

class grid_image_box extends grid_static_base_box
{
	public function __construct() 
	{
		$this->content=new StdClass();
		$this->content->fileid="";
		$this->content->url = "";
		$this->content->imagestyle = "";
	}
	
	public function type() {
		return 'image';
	}

	public function build($editmode) {
		//boxes render their content in here
		if(isset($this->content->fileid) && $this->content->fileid!="")
		{
			$file=file_load($this->content->fileid);

			$a_pre = "";
			$a_post = "";
			if(isset($this->content->url) && $this->content->url != ""){
				$a_pre = '<a href="'.$this->content->url.'">';
				$a_post = '</a>';
			}
			if($editmode)
			{
				$a_post.=" (".$file->filename.")";
			}

			$src = "no_file";
			if(is_object($file)){
				if(isset($this->content->imagestyle) && $this->content->imagestyle != ""){
					$src = image_style_url($this->content->imagestyle , $file->uri );
				} else {
					$src = file_create_url($file->uri);
				}				
			}
			return $a_pre."<img src='".$src."' alt='Grid Image' />".$a_post;
		}
		return 'Bildbox';
	}
	
	
	public function contentStructure () {
		$styles = array(
				array("text" => "- ".t("Original")." -", "key" => ""),
			);
		foreach (image_styles() as $key => $style) {
			$styles[] = array("text" => $key, "key" => $key );
		}
		return array(
			array(
				'key'=>'fileid',
				'type'=>'file',
				'label'=>t('Image'),
				'uploadpath'=>'/grid_file_endpoint',
			),
			array(
				'key' => 'url',
				'type' => 'text',
				'label' => t('URL (optional)'),
			),
			array(
				'key' => 'imagestyle',
				'type' => 'select',
				'label' => t('Image style'), 
				'selections'=>$styles,
			),
		);
	}
	
	public function delete() {
		if($this->content->fileid!="")
		{
			//$file=file_load($this->content->fileid);
			//file_delete($file);
		}
		parent::delete();
	}

	
	public function performFileUpload($key,$path,$original_file)
	{
		if($key!='fileid')
			return FALSE;//array('result'=>FALSE,'error'=>'wrong key');
		$content=file_get_contents($path);
		$filename=basename($path);
		$path="public://grid/".date("Y/m/d")."/";
		file_prepare_directory($path,FILE_CREATE_DIRECTORY);
		$file=file_save_data($content,$path.$original_file);
		return $file->fid;
	}
	
	public function prepareReuseDeletion()
	{
		$this->content->fileid="";
	}


}