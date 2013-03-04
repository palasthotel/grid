<?php

class griddb {

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
}