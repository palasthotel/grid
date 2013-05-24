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
			return "Node is lost";
		}
		if($editmode)
		{
			return $node->type.': '.$node->title.' ('.date("Y-m-d h:i:s",$node->created).")";
		}
		else
		{
			return drupal_render(node_view($node,$this->content->viewmode));
		}
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Inhalte";
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
		$query->entityCondition('entity_type','node')
		      ->propertyCondition('title','%'.$search.'%','LIKE')
		      ->propertyOrderBy('created','DESC');
		$result=$query->execute();
		if(isset($result['node']))
		{
			$nids=array_keys($result['node']);
			$nodes=entity_load('node',$nids);
			foreach($nodes as $node)
			{
				$type=$node->type;
				if(variable_get('grid_'.$type.'_enabled',0)==0)
				{
					$box=new grid_node_box();
					$box->content=new StdClass();
					$box->content->nid=$node->nid;
					$box->content->viewmode="teaser";
					$results[]=$box;
				}
			}
		}
		return $results;
	}
	
	public function contentStructure () {
		$view_modes=grid_viewmodes();
		$modes=array();
		foreach($view_modes as $key=>$info)
		{
			$modes[]=array('key'=>$key,'text'=>$info['label']);
		}
		$params=array(
			array(
				'key'=>'viewmode',
				'type'=>'select',
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