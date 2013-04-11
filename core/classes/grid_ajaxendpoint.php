<?php

class grid_ajaxendpoint {
	public $storage;

	//only a test method to check that our ajax management works
	public function add($a,$b) {
		return $a+$b;
	}
	
	private function encodeBox($box)
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
		$bx['type']=$box->type();
		return $bx;
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
					$bx=$this->encodeBox($box);
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
	
	public function addBox($gridid,$containerid,$slotid,$boxid,$idx)
	{
		$grid=$this->storage->loadGrid($gridid);
		$box=$this->storage->loadBox($boxid);
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						return $slot->addBox($idx,$box);
					}
				}
			}
		}
		return false;
	}

	public function moveBox($gridid,$oldcontainerid,$oldslotid,$oldidx,$newcontainerid,$newslotid,$newidx)
	{
		$grid=$this->storage->loadGrid($gridid);
		$box=null;
		foreach($grid->container as $container)
		{
			if($container->containerid==$oldcontainerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$oldslotid)
					{
						$box=$slot->boxes[$oldidx];
						$slot->removeBox($oldidx);
					}
				}
			}
		}
		if($box==null)
			return false;
		foreach($grid->container as $container)
		{
			if($container->containerid==$newcontainerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$newslotid)
					{
						return $slot->addBox($newidx,$box);
					}
				}
			}
		}
		return false;
	}

	public function removeBox($gridid,$containerid,$slotid,$idx)
	{
		$grid=$this->storage->loadGrid($gridid);
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						return $slot->removeBox($idx);
					}
				}
			}
		}
		return false;
	}


	public function publishDraft()
	{
		//TODO: WORK HERE!!!
	}

	public function revertDraft()
	{
		//TODO: WORK HERE!!!
	}
	
	public function getStyles()
	{
		return $this->storage->fetchStyles();
	}
	
	public function searchBox($searchstring)
	{
		$boxes=$this->storage->fetchBoxesMatchingTitle($searchstring);
		$return=array();
		foreach($boxes as $box)
		{
			$return[]=$this->encodeBox($box);
		}
		return $return;
	}

}