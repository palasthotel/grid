<?php

class grid_ajax_styles_component extends grid_ajax_component {

    function component_name()
    {
        return "grid.styles";
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
}
