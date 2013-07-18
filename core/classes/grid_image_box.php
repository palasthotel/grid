<?php

class grid_image_box extends grid_static_base_box
{
	public function __construct() 
	{
		$this->content=new StdClass();
		$this->content->fileid="";
	}
	
	public function type() {
		return 'image';
	}

	public function build($editmode) {
		//boxes render their content in here
		if($this->content->fileid!="")
		{
			return "<img src='".file_create_url(file_load($this->content->fileid)->uri)."'/>";
		}
		return 'Bildbox';
	}
	
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'fileid',
				'type'=>'file',
				'uploadpath'=>'/grid_file_endpoint',
			),
		);
	}
	
	public function performFileUpload($key,$path)
	{
		if($key!='fileid')
			return FALSE;//array('result'=>FALSE,'error'=>'wrong key');
		$content=file_get_contents($path);
		$filename=basename($path);
		$file=file_save_data($content,"public://".$filename);
		return $file->fid;
	}


}