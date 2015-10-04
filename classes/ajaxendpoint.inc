<?php

namespace grid_plugin;

class ajaxendpoint extends \grid_ajaxendpoint {

	public function loadGrid( $gridid )
	{
		global $wpdb;
		$return = parent::loadGrid( $gridid );
		if ( 0 != strncmp( 'box:', $gridid, strlen( 'box:' ) ) && 0 != strncmp( 'container:', $gridid, strlen( 'container:' ) ) ) {
			$rows = $wpdb->get_results( 'select nid from '.$wpdb->prefix."grid_nodes where grid_id=$gridid" );
			$post = get_post( $rows[0]->nid );
			$type = $post->post_type;
			if ( $type == get_option( 'grid_sidebar_post_type' ) ) {
				$return['isSidebar'] = true;
			} else {
				$return['isSidebar'] = false;
			}
		}
		return $return;
	}

	public function Rights()
	{
		$privs = grid_wp_get_privs();
		$privileges = array();
		foreach ( $privs as $role => $privs ) {
			if ( current_user_can( $role ) ) {
				foreach ( $privs as $key => $val ) {
					if ( $val ) {
						if ( ! in_array( $key, $privileges ) ) {
							$privileges[] = $key;
						}
					}
				}
			}
		}
		return $privileges;
	}

	public function publishDraft($gridid)
	{
		$result=parent::publishDraft($gridid);
		if($result)
		{
			$nid=grid_wp_get_postid_by_grid($gridid);
			do_action('grid_published',$nid);
		}
		return $result;
	}
	public function getMetaTypesAndSearchCriteria($grid_id){
		$result=parent::getMetaTypesAndSearchCriteria($grid_id);
		$post_id=NULL;
		if(strncmp("container:",$grid_id,strlen("container:"))==0)
		{
			$post_id=NULL;
		}
		else if(strncmp("box:",$grid_id,strlen("box:"))==0)
		{
			$post_id=NULL;
		}
		else
		{
			$post_id=grid_wp_get_postid_by_grid($grid_id);
		}
		$result=apply_filters('grid_metaboxes',$result,$grid_id,$post_id);
		return $result;
	}

	public function Search($grid_id,$metatype,$searchstring,$criteria)
	{
		$result=parent::Search($grid_id,$metatype,$searchstring,$criteria);
		if(strncmp("container:",$grid_id,strlen("container:"))==0)
		{
			$post_id=NULL;
		}
		else if(strncmp("box:",$grid_id,strlen("box:"))==0)
		{
			$post_id=NULL;
		}
		else
		{
			$post_id=grid_wp_get_postid_by_grid($grid_id);
		}
		$result=apply_filters('grid_boxes_search',$result,$grid_id,$post_id);
		return $result;
	}

	public function getContainerTypes($grid_id)
	{
		$result=parent::getContainerTypes($grid_id);
		if(strncmp("container:",$grid_id,strlen("container:"))==0)
		{
			$post_id=NULL;
		}
		else if(strncmp("box:",$grid_id,strlen("box:"))==0)
		{
			$post_id=NULL;
		}
		else
		{
			$post_id=grid_wp_get_postid_by_grid($grid_id);
		}
		$result=apply_filters('grid_containers',$result,$grid_id,$post_id);
		return $result;
	}

	public function getReusableContainers($grid_id)
	{
		$result=parent::getReusableContainers($grid_id);
		$result=apply_filters('grid_reusable_containers',$result,$grid_id,grid_wp_get_postid_by_grid($grid_id));
		return $result;
	}

	public function UpdateBox($gridid,$containerid,$slotid,$idx,$boxdata)
	{
		$result=parent::UpdateBox($gridid,$containerid,$slotid,$idx,$boxdata);
		if($result!=FALSE)
		{
			$grid=$this->storage->loadGrid($gridid);
			foreach($grid->container as $container)
			{
				if($container->containerid==$containerid)
				{
					foreach($container->slots as $slot)
					{
						if($slot->slotid==$slotid)
						{
							if(isset($slot->boxes[$idx]))
							{
								//we found a box.
								$box=$slot->boxes[$idx];
								$box=apply_filters('grid_persist_box',$box);
								if(is_array($box) && count($box)>0 && $box[0]!==NULL)
								{
									$box=$box[0];
									$slot->boxes[$idx]=$box;
									$box->persist();
								}
								else
								{
									$box=$slot->boxes[$idx];
								}
								return $this->encodeBox($box);
							}
							return FALSE;
						}
					}
				}
			}
		}
	}

}