<?php

class grid_node_box extends grid_box {
	
	public function type()
	{
		return 'node';
	}

	public function build($editmode) {
		$node=node_load($this->content->nid);
		if($node==FALSE)
		{
			return t("Node is lost");
		}
		if($editmode)
		{
			return $node->type.': '.$node->title.' ('.date("Y-m-d h:i:s",$node->created).")";
		}
		else
		{
			$view_modes=grid_viewmodes();
					  
			// print_r($view_modes);		  
			
			if (!array_key_exists($this->content->viewmode, $view_modes)){
			    $this->content->viewmode = grid_default_viewmode();
			}
			if(node_access("view",$node))
				return drupal_render(node_view($node,$this->content->viewmode));
			else
				return "";
		}
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Contents";
	}
	
	public function metaSearchCriteria() {
		return array("title");
	}
	
	public function metaSearch($criteria,$search) {
		if($search=='')
		{
			return array();
		}
		$results=array();
		$query=new EntityFieldQuery();
		$words=explode(" ", $search);
		$query->entityCondition('entity_type','node')
		      ->propertyOrderBy('created','DESC');
		$wordquery=array();
		foreach($words as $word)
		{
			$query->propertyCondition('title','%'.$word.'%','LIKE');
		}
		$query->range(0,50);
		$result=$query->execute();
		if(isset($result['node']))
		{
			$nids=array_keys($result['node']);
			$nodes=entity_load('node',$nids);
			foreach($nodes as $node)
			{
				$type=$node->type;
				$box=new grid_node_box();
				$box->content=new StdClass();
				$box->content->nid=$node->nid;
				$box->content->viewmode=grid_default_viewmode();
				$results[]=$box;
			}
		}
		return $results;
	}
	
	public function contentStructure () {
		$view_modes=grid_viewmodes();
		$modes=array();
		$node=NULL;
		if($this->content->nid!="")
		{
			$node=node_load($this->content->nid);
		}
		foreach($view_modes as $key=>$info)
		{
			if($key=='full')
			{
				// noticegefahr durch nicht immer gesetztes $node Objekt
				if($node!=NULL && variable_get('grid_'.$node->type.'_enabled',0)==0)
				{
					$modes[]=array('key'=>$key,'text'=>$info['label']);
				}
			}
			else
			{
				$modes[]=array('key'=>$key,'text'=>$info['label']);
			}
		}
		$params=array(
			array(
				'key'=>'viewmode',
				'type'=>'select',
				'label'=> t('Viewmode'),
				'selections'=>$modes,
			),
			array(
				'key'=>'nid',
				'type'=>'hidden',
			),
		);
		return $params;
	}

}