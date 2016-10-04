<?php

class grid_ajax_permissions_component extends grid_ajax_component {

    function component_name() {
        return "grid.permissions";
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
}