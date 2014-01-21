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
		$this->content->postid='';
	}
	
	public function build($editmode)
	{
		if($this->content->postid!='')
		{
			$gridid=grid_wp_get_grid_by_postid($this->content->postid);
			if($gridid!==FALSE)
			{
				$grid=$this->storage->loadGrid($gridid,FALSE);
				return $grid->render($editmode);
			}
			else
			{
				return "sidebar is lost.";
			}
		}
		else
		{
			return "Sidebar not found or none set";
		}
	}
	
	public function contentStructure()
	{
		$content = array(
			array(
				'key'=>'postid',
				'label'=>'Sidebar',
				'type'=>'autocomplete-with-links',
				'url'=>add_query_arg(array('page'=>'grid','postid'=>'%'),admin_url('admin.php')),
				'linktext'=>'Edit Sidebar',
				'emptyurl'=>add_query_arg(array('post_type'=>get_option('grid_sidebar_post_type','sidebar')),admin_url('post-new.php')),
				'emptylinktext'=>'Create Sidebar',
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
	
	public function performElementSearch($key,$querystr)
	{
		if($key!='postid')
		{
			return array(array('key'=>-1,'value'=>'invalid key'));
		}
		$results=array();
		$sidebar_type = get_option('grid_sidebar_post_type','sidebar');
		$count = wp_count_posts( $sidebar_type );
		$query=new WP_Query(array('post_type'=>$sidebar_type, 'posts_per_page' => $count));
		$i = 0;
		while($query->have_posts() && $i < 15)
		{
			$i++;
			$query->the_post();
			$post=get_post();
			if(is_numeric(strpos($post->post_title,$querystr)))
			{
				$results[]=array('key'=>$post->ID,'value'=>$post->post_title);
			}
		}
		wp_reset_postdata();
		return $results;
	}
	
	public function getElementValue($path,$id)
	{
		if($path!='postid')
			return 'WRONG PATH: '.$path;
		$post=get_post($id);
		return $post->post_title;
	}
}