<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

use Grid\Constants\Hook;

class grid_grid extends grid_base {
	public $container;
	public $gridid;
	public $gridrevision;
	public $isPublished;
	public $isDraft;

	public function render($editmode)
	{
		$this->storage->fireHook(Hook::WILL_RENDER_GRID, (object) array('grid'=>$this,'editmode'=>$editmode));
		
		$containermap=array();
		$containerlist=array();
		
		$this->preprocessContainer();
		
		
		foreach($this->container as $container)
		{
			/**
			 * @var $container grid_container
			 */
			$html=$container->render($editmode);
			$containermap[$container->containerid]=$html;
			$containerlist[]=$html;
		}
		ob_start();


		$found = FALSE;
		if( is_array( $this->storage->templatesPaths) )
		{
			foreach ($this->storage->templatesPaths as $templatesPath) {
				$template_path = rtrim($templatesPath.'/grid.tpl.php', "/");
				if( file_exists($template_path) ){
					include $template_path;
					$found = TRUE;
					break;
				}				
			}
			
		}
		if(!$found)
		{
			include dirname(__FILE__).'/../templates/frontend/grid.tpl.php';
		}
		
		$output=ob_get_clean();
		$this->storage->fireHook(Hook::DID_RENDER_GRID, (object) array('grid'=>$this, 'editmode'=>$editmode));
		return $output;
	}
	
	public function revisions()
	{
		return $this->storage->gridRevisions($this);
	}

	public function publish()
	{
		return $this->storage->publishGrid($this);
	}
	
	public function cloneGrid()
	{
		return $this->storage->cloneGrid($this);
	}

	public function revoke()
	{
		return $this->storage->revokeGrid($this);
	}

	public function insertContainer($containertype,$idx)
	{
		$container=$this->storage->createContainer($this,$containertype);

		$list=$this->container;
		array_splice($list, $idx,0,array($container));
		$this->container=$list;
		$this->storeContainerOrder();
		return $container;
	}

	public function storeContainerOrder()
	{
		$this->storage->storeContainerOrder($this);
	}

	public function draftify()
	{
		$grid=$this->storage->createRevision($this);
		return $grid;
	}

	public function moveContainer($containerid,$newidx)
	{
		$oldidx=-1;
		for($i=0;$i<count($this->container);$i++)
		{
			if($this->container[$i]->containerid==$containerid)
			{
				$oldidx=$i;
			}
		}
		if($oldidx==-1)
		{
			return false;
		}
		$array=$this->container;
		$container=$array[$oldidx];
		$offset=0;
		$direction=0;
		$stop=0;
		if($oldidx<$newidx)
		{
			$offset=+1;
			$direction=+1;
			$stop=$newidx;
		}
		else
		{
			$offset=-1;
			$direction=-1;
			$stop=$newidx;
		}
		$i=$oldidx;
		while($i!=$stop)
		{
			$array[$i]=$array[$i+$offset];
			$i=$i+$direction;
		}
		$array[$newidx]=$container;
		$this->container=$array;
		$this->storeContainerOrder();
		return true;
	}

	public function removeContainer($containerid)
	{
		$idx=-1;
		for($i=0;$i<count($this->container);$i++)
		{
			if($this->container[$i]->containerid==$containerid)
			{
				$idx=$i;
			}
		}
		if($idx==-1)
		{
			return false;
		}
		$container=$this->container[$idx];
		$this->storage->fireHook( Hook::DELETE_CONTAINER, (object) array("container" => $container, "index" => $idx ));
		array_splice($this->container, $idx,1);
		$this->storeContainerOrder();
		$this->storage->destroyContainer($container);
		return true;
	}
	
	public function updateContainer($containerid,$containerdata)
	{
		$idx=-1;
		for($i=0;$i<count($this->container);$i++)
		{
			if($this->container[$i]->containerid==$containerid)
			{
				$idx=$i;
			}
		}
		if($idx==-1)
		{
			return false;
		}
		$container=$this->container[$idx];
		return $container->update($containerdata);
	}
	
	public function preprocessContainer(){
		// Start Container Preprocessing by ben_
		// optimized by edward
		$precontainer = false;
		$nextcontainer = false;
		
		$withincontentcontainers = false;
		$contentcontaineropencounter = 0;
		$contentcontainerclosecounter = 0;
		$i = 0;
		foreach($this->container as $container){
			/**
			 * @var $container grid_container
			 */
			$mycontainer = $container;
			$this->container[$i]->position = $i;
			
			if($i == 0){
				$prevcontainer = new grid_container();
			}else{
				$prevcontainer = $this->container[$i-1];
			}
			
			if($i == count($this->container) -1){
				$nextcontainer = new grid_container();
			}else{
				$nextcontainer = $this->container[$i+1];
			}
			
			// if container with sidebarspace and previous was none or was last one, than start wrapper
			if($mycontainer->is_content_container() && (!$prevcontainer->is_content_container() || $prevcontainer->lastcontentcontainer) ){
				$this->container[$i]->firstcontentcontainer = true;
				$withincontentcontainers = true;
				$contentcontaineropencounter ++;
			}else{
				$this->container[$i]->firstcontentcontainer = false;
			}
			

			if(
				$withincontentcontainers && 
				$mycontainer->is_content_container() && 
				$nextcontainer->is_content_container() &&
				$mycontainer->space_to_right == $nextcontainer->space_to_right &&
				$mycontainer->space_to_left == $nextcontainer->space_to_left
				){
				$this->container[$i]->lastcontentcontainer = false;
			}elseif(
				$withincontentcontainers && 
				$mycontainer->is_content_container() && 
				
				( !$nextcontainer->is_content_container() || 
				$mycontainer->space_to_right != $nextcontainer->space_to_right ||
				$mycontainer->space_to_left != $nextcontainer->space_to_left ) ){

				$this->container[$i]->lastcontentcontainer = true;
				$withincontentcontainers = false;
				$contentcontainerclosecounter ++;
			}else{
				$this->container[$i]->lastcontentcontainer = false;
			}
			$i++;
		}
		// End Container Preprocessing by ben_
		// optimized by edward
	}
	
}