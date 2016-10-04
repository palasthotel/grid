<?php

class grid_ajax_document_component extends grid_ajax_component {
    function component_name()
    {
        return "grid.document";
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

    public function getGridRevisions($gridid,$page=0){
        return $this->storage->fetchGridRevisions($gridid,$page);
    }

    public function setToRevision($gridid, $revision){
        $this->revertDraft($gridid);
        $grid=$this->storage->loadGridByRevision($gridid,$revision);
        $grid=$grid->draftify();
        return $this->encodeGrid($grid);
    }

    public function loadGrid($gridid) {
        $grid=$this->storage->loadGrid($gridid);
        return $this->encodeGrid($grid);

    }

}