<?php

class grid_ajax_component {

    /** @var  grid_db $storage */
    public $storage;

    function __construct($storage) {
        $this->storage=$storage;
    }

    function component_name() {
        return "NULL";
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

    protected function encodeContainer($container)
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

    protected function encodeBox(grid_box $box)
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
        $bx['html']=$box->render(true);
        $bx['type']=$box->type();
        $bx['content']=$box->content;
        $bx['contentstructure']=$box->contentStructure();
        return $bx;
    }
}