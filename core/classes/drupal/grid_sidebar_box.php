<?php

class grid_sidebar_box extends grid_box
{
	public function type()
	{
		return "sidebar";
	}
	
	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->nodeid='';
	}
	
	public function build($editmode)
	{
		if($this->content->nodeid!='')
		{
			$gridid=grid_get_grid_by_nid($this->content->nodeid);
			if($gridid!==FALSE)
			{
				$grid=$this->storage->loadGrid($gridid,FALSE);
				return $grid->render($editmode);
			}
			else
			{
				return t("Sidebar is lost.");
			}
		}
		else
		{
			return t("Sidebar not found or none set");
		}
	}
	
	public function contentStructure()
	{
		$content = array(
			array(
				'key'=>'nodeid',
				'label'=>t('Sidebar'),
				'type'=>'autocomplete-with-links',
				'url'=>'/node/%/grid',
				'linktext'=>t('Edit Sidebar'),
				'emptyurl'=>'/node/add/'.variable_get('grid_sidebar',''),
				'emptylinktext'=>t('Create Sidebar'),
			),
			array(
				'key'=>'html',
				'type'=>'hidden',
			),
		);
		if($this->content->nodeid!='')
		{
			$node=node_load($this->content->nodeid);
			if($node!=NULL)
			{
				$content[0]['valuekey']=$node->title;
			}
		}
		return $content;
	}

	public function performElementSearch($key,$query)
	{
		if($key!='nodeid')
		{
			return array(array('key'=>-1,'value'=>'invalid key'));
		}
		$results=array();
		$dbquery=new EntityFieldQuery();
		$dbquery->entityCondition('entity_type','node')
			  ->entityCondition('bundle',variable_get('grid_sidebar',''))
		      ->propertyCondition('title','%'.$query.'%','LIKE')
		      ->propertyOrderBy('created','DESC');
		$result=$dbquery->execute();
		if(isset($result['node']))
		{
			$nids=array_keys($result['node']);
			$nodes=entity_load('node',$nids);
			foreach($nodes as $node)
			{
				$results[]=array('key'=>$node->nid,'value'=>$node->title);
			}
		}
		return $results;
	}
	
	public function getElementValue($path,$id)
	{
		if($path!='nodeid')
			return 'WRONG PATH: '.$path;
		$node=node_load($id);
		return $node->title;
	}
}