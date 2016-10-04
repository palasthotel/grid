<?php

class grid_ajax_typeahead_component extends grid_ajax_component {
    function component_name() {
        return "grid.widgets.typeahead";
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
}