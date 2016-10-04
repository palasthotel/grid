<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_ajaxendpoint {
	/** @var grid_db $storage */
	public $storage;
    /** @var grid_ajax_component[] $components */
    public $components;

    function __construct($storage) {
        $this->storage=$storage;
        $this->components=array();
        $classes=get_declared_classes();
        foreach($classes as $class) {
            if(is_subclass_of($class,'grid_ajax_component')) {
                /** @var grid_ajax_component $comp */
                $comp=new $class($this->storage);
                $name=$comp->component_name();
                if(isset($this->components[$name])) {
                    $present=$this->components[$name];
                    $present_class=get_class($present);
                    if(is_subclass_of($class,$present_class)) {
                        $this->components[$name]=$comp;
                    }
                } else {
                    $this->components[$name]=$comp;
                }
            }
        }
    }

    function perform($json) {
        $component=$json->component;
        $method=$json->method;
        $params=$json->params;

        $comp=$this->components[$component];
        if($comp==null) {
            return array('error'=>'Component not found');
        }
        try {
            $reflectionMethod=new reflectionMethod($comp,$method);
            $retval=$reflectionMethod->invokeArgs($comp,$params);
            return array('result'=>$retval);
        } catch (Exception $e) {
            return array('error'=>$e->getMessage());
        }
    }

}