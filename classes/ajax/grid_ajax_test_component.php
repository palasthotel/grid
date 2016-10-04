<?php

class grid_ajax_test_component extends grid_ajax_component {

    function component_name()
    {
        return "grid.test";
    }

    //only a test method to check that our ajax management works
    public function add($a,$b) {
        return $a+$b;
    }

    public function allMethods() {
        $ajax=$this->storage->ajaxEndpoint;
        $comps=$ajax->components;
        $ret=array();
        foreach($comps as $name=>$comp) {
            $item=array();
            $item['class']=get_class($comp);
            $reflector=new ReflectionClass($item['class']);
            $item['file']=$reflector->getFileName();
            $item['methods']=array();
            $methods=get_class_methods($item['class']);
            foreach($methods as $method) {
                $item['methods'][]=$method;
            }
            $ret[$name]=$item;
        }
        return $ret;
    }
}
