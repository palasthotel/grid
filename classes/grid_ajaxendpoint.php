<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_ajaxendpoint {
	public $storage;

	//only a test method to check that our ajax management works
	public function add($a,$b) {
		return $a+$b;
	}
	
	protected function encodeBox($box)
	{
		$bx=array();
		foreach(get_object_vars($box) as $key=>$value)
		{
			if($key!='storage' && $key!='content' && $key!='boxid' && $key!='grid')
			{
				$bx[$key]=$value;
			}
		}
		$bx['id']=$box->boxid;
		$bx['html']=$box->build(true);
		$bx['type']=$box->type();
		$bx['content']=$box->content;
		$bx['contentstructure']=$box->contentStructure();
		return $bx;
	}
	
	private function encodeContainer($container)
	{
		$cnt=array();
		foreach(get_object_vars($container) as $key=>$value)
		{
			if($key!='storage' && $key!='slots' && $key!='containerid' && $key!='grid')
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
			$slt['style']=$slot->style;
			$slt['boxes']=array();
			foreach($slot->boxes as $box)
			{
				$bx=$this->encodeBox($box);
				$slt['boxes'][]=$bx;
			}
			$cnt['slots'][]=$slt;
		}
		return $cnt;
	}

	public function encodeGrid($grid)
	{
		$converted=array();
		$converted['id']=$grid->gridid;
		$converted['isDraft']=$grid->isDraft;
		$converted['container']=array();
		foreach($grid->container as $container)
		{
			$cnt=$this->encodeContainer($container);
			$converted['container'][]=$cnt;
		}
		return $converted;
	}
	public function loadGrid($gridid) {
		$grid=$this->storage->loadGrid($gridid);
		return $this->encodeGrid($grid);

	}
	
	public function fetchBox($gridid,$containerid,$slotid,$boxidx)
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
						$box=$slot->boxes[$boxidx];
						if(!isset($box))return false;
						return $this->encodeBox($box);
					}
				}
			}
		}
		return false;
	}
	
	public function checkDraftStatus($gridid) {
		$grid=$this->storage->loadGrid($gridid);
		if($grid->isDraft)
		{
			return true;
		}
		else
		{
			return false;
		}
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
			'style'=>$container->style,
			'slots'=>array(),
			'space_to_right'=>$container->space_to_right,
			'space_to_left' => $container->space_to_left,
		);
		foreach($container->slots as $slot)
		{
			$slt=array();
			$slt['id']=$slot->slotid;
			$slt['style']=$slot->style;
			$slt['boxes']=array();
			foreach($slot->boxes as $box)
			{
				$slt['boxes'][]=$this->encodeBox($box);
			}
			$result['slots'][]=$slt;
		}
		return $result;
	}
	
	public function addReuseContainer($gridid,$idx,$containerid)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		$container=$grid->insertContainer("I-0",$idx);
		$this->storage->convertToReferenceContainer($container,$containerid);
		$reusecontainer=$this->storage->loadReuseContainer($containerid);		
		$reusecontainer->containerid=$container->containerid;

		$cnt=array();
		foreach(get_object_vars($reusecontainer) as $key=>$value)
		{
			if($key!='storage' && $key!='slots' && $key!='containerid' && $key!='grid')
			{
				$cnt[$key]=$value;
			}
		}
		$cnt['id']=$reusecontainer->containerid;
		$cnt['slots']=array();
		foreach($reusecontainer->slots as $slot)
		{
			$slt=array();
			$slt['id']=$slot->slotid;
			$slt['style']=$slot->style;
			$slt['boxes']=array();
			foreach($slot->boxes as $box)
			{
				$bx=$this->encodeBox($box);
				$slt['boxes'][]=$bx;
			}
			$cnt['slots'][]=$slt;
		}
		
		return $cnt;
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
	
	public function moveBox($gridid,$oldcontainerid,$oldslotid,$oldidx,$newcontainerid,$newslotid,$newidx)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		$box=null;
		$newslot=null;
		foreach($grid->container as $container)
		{
			if($container->containerid==$newcontainerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$newslotid)
					{
						$newslot=$slot;
					}
				}
			}
		}
		if($newslot==null)
			return false;
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
		return $newslot->addBox($newidx,$box);
	}

	public function removeBox($gridid,$containerid,$slotid,$idx)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						$box=null;
						if(isset($slot->boxes[$idx]))
							$box=$slot->boxes[$idx];
						$ret=$slot->removeBox($idx);
						if($ret)
						{
							$box->delete();
						}
						return $ret;
					}
				}
			}
		}
		return false;
	}
	
	public function reuseBox($gridid,$containerid,$slotid,$idx)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						$box=null;
						if(isset($slot->boxes[$idx]))
							$box=$slot->boxes[$idx];
						//next steps:
						//1. create copy of box
						$class="grid_".$box->type()."_box";
						$clone=new $class();
						//2. add box to reuse grid
						$reuseGrid=$this->storage->getReuseGrid();
						$clone->grid=$reuseGrid;
						$clone->storage=$this->storage;
						$clone->updateBox($box);
						$clone->persist();
						//3. remove box from this slot
						$box->prepareReuseDeletion();
						$slot->removeBox($idx);
						$box->delete();
						
						//4. add new reference box to this slot
						$reference=new grid_reference_box();
						$reference->content->boxid=$clone->boxid;
						$reference->storage=$this->storage;
						$reference->grid=$grid;
						$reference->persist();
						$slot->addBox($idx,$reference);
						return $this->encodeBox($reference);
					}
				}
			}
		}
	}
	
	public function reuseContainer($gridid,$containerid,$title)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				$this->storage->reuseContainer($grid,$container,$title);
				return true;
			}
		}
		return false;
	}
	
	public function getReusableContainers($grid_id)
	{
		$ids=$this->storage->getReuseContainerIds();
		$result=array();
		
		foreach($ids as $id)
		{
			$container=$this->storage->loadReuseContainer($id);
			$result[]=$this->encodeContainer($container);
		}
		return $result;
	}


	public function publishDraft($gridid)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			return false;
		}
		return $grid->publish();

	}

	public function revertDraft($gridid)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft || count($grid->revisions())==1)
		{
			return false;
		}
		$grid->revoke();
		return $this->loadGrid($gridid);
	}

	public function getGridRevisions($gridid){
		return $this->storage->fetchGridRevisions($gridid);
	}
	// TODO: copy old revision to new draft
	public function setToRevision($gridid, $revision){
		$this->revertDraft($gridid);
		$grid=$this->storage->loadGridByRevision($gridid,$revision);
		$grid=$grid->draftify();
		return $this->encodeGrid($grid);
	}
	
	public function getContainerStyles()
	{
		return $this->storage->fetchContainerStyles();
	}

	public function getSlotStyles()
	{
		return $this->storage->fetchSlotStyles();
	}

	public function getBoxStyles()
	{
		return $this->storage->fetchBoxStyles();
	}
	
	public function updateSlotStyle($gridid,$containerid,$slotid,$style)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						return $slot->setStyle($style);
					}
				}
			}
		}
		return false;
	}
	
	public function getMetaTypesAndSearchCriteria($grid_id){
		$boxes=$this->storage->getMetaTypes();
		$result=array();
		foreach($boxes as $box)
		{
			$elem=array(
				'type'=>$box->type(),
				'title'=>$box->metaTitle(),
				'criteria'=>$box->metaSearchCriteria(),
			);
			$result[]=$elem;
		}
		return $result;
	}
	
	public function Search($grid_id,$metatype,$searchstring,$criteria)
	{
		$class="grid_".$metatype."_box";
		$obj=new $class();
		$obj->storage=$this->storage;
		$searchresult=$obj->metaSearch($criteria,$searchstring);
		$return=array();
		foreach($searchresult as $box)
		{
			$return[]=$this->encodeBox($box);
		}
		return $return;
	}
	
	public function CreateBox($gridid,$containerid,$slotid,$idx,$boxtype,$content)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		$destslot=null;
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						$destslot=$slot;
					}
				}
			}
		}
		if($destslot==null)
			return FALSE;
		$class="grid_".$boxtype."_box";
		$box=new $class();
		$box->content=$content;
		$box->grid=$grid;
		$box->style=$this->storage->boxstyle;
		$box->storage=$this->storage;
		//now we can save the box. which is important.
		$ret=$box->persist();
		if($ret)
			$ret=$destslot->addBox($idx,$box);
		if($ret)
		{
			return $this->encodeBox($box);
		}
		return $ret;
	}
	
	public function UpdateBox($gridid,$containerid,$slotid,$idx,$boxdata)
	{
		$grid=$this->storage->loadGrid($gridid);
		if(!$grid->isDraft)
		{
			$grid=$grid->draftify();
		}
		foreach($grid->container as $container)
		{
			if($container->containerid==$containerid)
			{
				foreach($container->slots as $slot)
				{
					if($slot->slotid==$slotid)
					{
						if(isset($slot->boxes[$idx]))
						{
							$ret=$slot->boxes[$idx]->updateBox($boxdata);
							if($ret)
							{
								return $this->encodeBox($slot->boxes[$idx]);
							}
						}
						return FALSE;
					}
				}
			}
		}
		return FALSE;
	}
	
	public function Rights()
	{
		return array(
			'create-container',
			'edit-container',
			'delete-container',
			'move-container',
			'create-box',
			'edit-box',
			'delete-box',
			'move-box',
			'publish',
			'revert',
		);
	}
	
	public function typeAheadSearch($gridid,$containerid,$slotid,$idx,$field,$query)
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
						if(isset($slot->boxes[$idx]))
						{
							$ret=$slot->boxes[$idx]->performElementSearch($field,$query);
							return $ret;
						}
					}
				}
			}
		}
		return array(array('key'=>-2,'value'=>'Box not found'));
	}
	
	public function typeAheadGetText($gridid,$containerid,$slotid,$idx,$path,$id)
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
						$box=$slot->boxes[$idx];
						return $box->getElementValue($path,$id);
					}
				}
				return "WRONG SLOT";
			}
		}
		return "WRONG CONTAINER";
	}
	
	public function getContainerTypes($grid_id)
	{
		return $this->storage->fetchContainerTypes();
	}

}