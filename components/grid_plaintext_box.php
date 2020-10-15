<?php

class grid_plaintext_box extends grid_static_base_box
{
  public function __construct()
  {
	parent::__construct();
	$this->content->plain = "";
  }

  public function type() {
	return 'plaintext';
  }

  public function build($editmode) {
	//boxes render their content in here
	if($editmode && $this->content->plain == ""){
	  return t("Plaintext");
	} if($editmode){
	  return str_replace(array("<",">"),array("&lt;", "&gt;"), $this->content->plain);
	}
	return $this->content->plain;
  }


  public function contentStructure () {
	return array(
	  array(
		'key'=>'plain',
		'type'=>'textarea',
		'label'=>t('Plaintext'),
	  ),
	);
  }


}