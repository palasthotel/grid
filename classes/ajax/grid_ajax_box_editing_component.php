<?php

class grid_ajax_box_editing_component extends grid_ajax_component {

    function component_name()
    {
        return "grid.editing.box";
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
                        /** @var grid_box $clone */
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
        /** @var grid_box $box */
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

    public function getMetaTypesAndSearchCriteria($grid_id){
        $boxes=$this->storage->getMetaTypes();
        $result=array();
        foreach($boxes as $box)
        {
	        /**
	         * @var grid_box $box
	         */
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
        /** @var grid_box $obj */
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
}