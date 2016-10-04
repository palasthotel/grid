<?php

class grid_ajax_container_editing_component extends grid_ajax_component {

    function component_name()
    {
        return "grid.editing.container";
    }

    public function getContainerTypes($grid_id)
    {
        return $this->storage->fetchContainerTypes();
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
}