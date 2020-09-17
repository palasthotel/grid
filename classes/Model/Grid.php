<?php

namespace Palasthotel\Grid\Model;

use Palasthotel\Grid\Core;

/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class Grid extends _Base {

	/**
	 * @var Container[]
	 */
	public $container;
	/**
	 * @var int
	 */
	public $gridid;
	/**
	 * @var int
	 */
	public $gridrevision;
	/**
	 * @var bool
	 */
	public $isPublished;
	/**
	 * @var bool
	 */
	public $isDraft;
	
	public function revisions()
	{
		return $this->storage->gridRevisions($this);
	}

	public function publish()
	{
		return $this->storage->publishGrid($this);
	}
	
	public function cloneGrid()
	{
		return $this->storage->cloneGrid($this);
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
		$this->storage->fireHook( Core::FIRE_DELETE_CONTAINER, (object) array( "container" => $container, "index" => $idx ));
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
	
}