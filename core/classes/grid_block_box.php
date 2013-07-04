<?php

class grid_block_box extends grid_box {
	
	public function type()
	{
		return 'block';
	}

	public function build($editmode) {
		if($editmode)
		{
			$blocks=module_invoke($this->content->module,'block_info');
			global $theme_key;
			drupal_alter('block_info',$blocks,$theme_key,$blocks);
			$block=$blocks[$this->content->delta];
			return "Block: ".$block['info'];
		}
		else
		{		
			$block=module_invoke($this->content->module,'block_view',$this->content->delta);
			if(@is_string($block['content']))
				return $block['content'];
			else
				return drupal_render($block);
		}
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return "Blöcke";
	}
	
	public function metaSearchCriteria() {
		return array("info");
	}
	
	public function metaSearch($criteria,$query) {
		global $theme_key;
		$blocks=array();
		$results=array();
		foreach(module_implements('block_info') as $module)
		{
			$module_blocks=module_invoke($module,'block_info');
			$blocks[$module]=$module_blocks;
		}
		drupal_alter('block_info',$blocks,$theme_key,$blocks);
		foreach($blocks as $module=>$modblocks)
		{
			foreach($modblocks as $delta=>$block)
			{
				$info=$block['info'];
				if ($info==""){
					$info="~~~~~";
				}
				if($query=='' || strstr($info, $query)!==FALSE)
				{
					$box=new grid_block_box();
					$box->content=new StdClass();
					$box->content->module=$module;
					$box->content->delta=$delta;
					$results[]=$box;
					
				}
			}
		}
		return $results;
	}
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'module',
				'type'=>'hidden',
			),
			array(
				'key'=>'delta',
				'type'=>'hidden',
			),
		);
	}

}