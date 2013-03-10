<?php

class griddb {

	public $ajaxEndpoint;

	public function __construct() {
		$this->ajaxEndpoint=new ajaxendpoint();
	}

	//loads a complete grid with all regions and boxes belonging to it.
	public function loadGrid($gridId)
	{
		$grid=new grid();
		$grid->storage=$this;
		$grid->gridid=$gridId;

		$region=new region();
		$region->storage=$this;
		$region->regionid=1;
		$grid->regions[]=$region;

		$box=new box();
		$box->storage=$this;
		$box->boxid=42;
		$box->title="Test Box";
		$region->boxes[]=$box;

		return $grid;
	}

	//saves a complete grid. boxes which are already saved, will be referenced
	public function saveGrid($grid)
	{

	}

	//returns an array of all saved boxes
	public function loadAllBoxes()
	{

	}

	//returns an array of all boxes matching the given title
	public function findBoxes($title)
	{

	}

	//returns an array of box types known
	public function boxtypes()
	{
		
	}

	//manages ajax call routing
	public function handleAjaxCall()
	{
		if($_SERVER['REQUEST_METHOD']!='POST')
		{
			echo json_encode(array('error'=>'only POSTing is allowed'));
		}
		else
		{
			$input=file_get_contents("php://input");
			$json=json_decode($input);
			$method=$json->method;
			$params=$json->params;

			$this->ajaxEndpoint->storage=$this;
			try {
				$reflectionMethod=new reflectionMethod($this->ajaxEndpoint,$method);
				$retval=$reflectionMethod->invokeArgs($this->ajaxEndpoint,$params);
				echo json_encode(array('result'=>$retval));
			} catch (Exception $e) {
				echo json_encode(array('error'=>$e->getMessage()));
			}
		}
	}
}