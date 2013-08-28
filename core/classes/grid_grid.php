<?php

class grid_grid extends grid_base {
	
	public $container;
	public $gridid;
	public $gridrevision;
	public $isPublished;
	public $isDraft;

	public function render($editmode)
	{
		$containermap=array();
		$containerlist=array();
		
		$this->preprocessContainer();
		
		
		foreach($this->container as $container)
		{
			$html=$container->render($editmode);
			$containermap[$container->containerid]=$html;
			$containerlist[]=$html;
		}
		ob_start();
		include dirname(__FILE__).'/../templates/grid.tpl.php';
		$output=ob_get_clean();
		return $output;
	}
	
	public function revisions()
	{
		return $this->storage->gridRevisions($this);
	}

	public function publish()
	{
		return $this->storage->publishGrid($this);
	}

	public function revoke()
	{
		return $this->storage->revokeGrid($this);
	}

	public function insertContainer($containertype,$idx)
	{
		$container=$this->storage->createContainer($this,$containertype);

		$list=$this->container;
		array_splice($list, $idx,0,array($container));
		$this->container=$list;
		$this->storeContainerOrder();
		return $container;
	}

	public function storeContainerOrder()
	{
		$this->storage->storeContainerOrder($this);
	}

	public function draftify()
	{
		$grid=$this->storage->createRevision($this);
		return $grid;
	}

	public function moveContainer($containerid,$newidx)
	{
		$oldidx=-1;
		for($i=0;$i<count($this->container);$i++)
		{
			if($this->container[$i]->containerid==$containerid)
			{
				$oldidx=$i;
			}
		}
		if($oldidx==-1)
		{
			return false;
		}
		$array=$this->container;
		$container=$array[$oldidx];
		$offset=0;
		$direction=0;
		$stop=0;
		if($oldidx<$newidx)
		{
			$offset=+1;
			$direction=+1;
			$stop=$newidx;
		}
		else
		{
			$offset=-1;
			$direction=-1;
			$stop=$newidx;
		}
		$i=$oldidx;
		while($i!=$stop)
		{
			$array[$i]=$array[$i+$offset];
			$i=$i+$direction;
		}
		$array[$newidx]=$container;
		$this->container=$array;
		$this->storeContainerOrder();
		return true;
	}

	public function removeContainer($containerid)
	{
		$idx=-1;
		for($i=0;$i<count($this->container);$i++)
		{
			if($this->container[$i]->containerid==$containerid)
			{
				$idx=$i;
			}
		}
		if($idx==-1)
		{
			return false;
		}
		$container=$this->container[$idx];
		array_splice($this->container, $idx,1);
		$this->storeContainerOrder();
		$this->storage->destroyContainer($container);
		return true;
	}
	
	public function updateContainer($containerid,$containerdata)
	{
		$idx=-1;
		for($i=0;$i<count($this->container);$i++)
		{
			if($this->container[$i]->containerid==$containerid)
			{
				$idx=$i;
			}
		}
		if($idx==-1)
		{
			return false;
		}
		$container=$this->container[$idx];
		return $container->update($containerdata);
	}
	
	public function preprocessContainer(){
		// Start Container Preprocessing by ben_
		$precontainer = false;
		$nextcontainer = false;
		
		$i = 0;
		foreach($this->container as $container){
			$mycontainer = $container;
			$this->container[$i]->position = $i;
			
			if($i == 0){
				$prevcontainer = new grid_container();
			}else{
				$prevcontainer = $this->container[$i-1];
			}
			
			if($i == count($this->container) -1){
				$nextcontainer = new grid_container();
			}else{
				$nextcontainer = $this->container[$i+1];
			}
			
					
			if($mycontainer->is_content_container() and !$prevcontainer->is_content_container()){
				$this->container[$i]->firstcontentcontainer = true;
			}else{
				$this->container[$i]->firstcontentcontainer = false;
			}
			
			if($mycontainer->is_content_container() and $nextcontainer->is_content_container()){
				$this->container[$i]->lastcontentcontainer = false;
			}else{
				$this->container[$i]->lastcontentcontainer = true;
			}
			$i++;
		}
		// End Container Preprocessing by ben_
	}
	
}