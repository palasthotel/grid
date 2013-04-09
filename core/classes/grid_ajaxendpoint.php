<?php

class grid_ajaxendpoint {
	public $storage;

	//only a test method to check that our ajax management works
	public function add($a,$b) {
		return $a+$b;
	}

	public function loadGrid($gridid) {
		$grid=$this->storage->loadGrid($gridid);

		$converted=array();
		$converted['id']=$grid->gridid;
		$converted['isDraft']=$grid->isDraft;
		$converted['container']=array();
		foreach($grid->container as $container)
		{
			$cnt=array();
			foreach(get_object_vars($container) as $key=>$value)
			{
				if($key!='storage' && $key!='slots' && $key!='containerid')
				{
					$cnt[$key]=$value;
				}
			}
			$cnt['id']=$container->containerid;
			$cnt['slots']=array();
			foreach($container->slots as $slot)
			{
				$slt=array();
				$slt['id']=$slot->slotid;
				$slt['boxes']=array();
				foreach($slot->boxes as $box)
				{
					$bx=array();
					foreach(get_object_vars($box) as $key=>$value)
					{
						if($key!='storage' && $key!='content' && $key!='boxid')
						{
							$bx[$key]=$value;
						}
					}
					$bx['id']=$box->boxid;
					$bx['content']=$box->build(true);
					$slt['boxes'][]=$bx;
				}
				$cnt['slots'][]=$slt;
			}
			$converted['container'][]=$cnt;
		}
		return $converted;
	}

	public function addContainer($gridid,$containertype,$idx)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		$container=$grid->insertContainer($containertype,$idx);
		$result=array(
			'id'=>$container->containerid,
			'slots'=>array()
		);
		foreach($container->slots as $slot)
		{
			$result['slots'][]=$slot->slotid;
		}
		return $result;
	}

	public function moveContainer($gridid,$containerid,$newidx)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		return $grid->moveContainer($containerid,$newidx);
	}

	public function deleteContainer($gridid,$containerid)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		return $grid->removeContainer($containerid);
	}

	public function updateContainer($gridid,$containerid,$containerdata)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		return $grid->updateContainer($containerid,$containerdata);
	}

	public function addBox()
	{
		//TODO: WORK HERE!!!
	}

	public function moveBox()
	{
		//TODO: WORK HERE!!!
	}

	public function deleteBox()
	{
		//TODO: WORK HERE!!!
	}


	public function publishDraft()
	{
		//TODO: WORK HERE!!!
	}

	public function revertDraft()
	{
		//TODO: WORK HERE!!!
	}
}