<?php

class grid_post_box extends grid_box {
	
	public function type()
	{
		return 'post';
	}

	public function build($editmode) {
		$post=get_post($this->content->postid);
		if($post==FALSE)
		{
			return "Post is lost";
		}
		if($editmode)
		{
			return $post->post_type.': '.$post->post_title.' ('.$post->post_date.")";//date("Y-m-d h:i:s",$post->post_date).")";
		}
		else
		{
			$query=new WP_Query(array("p"=>$this->content->postid,"post_type"=>array('post','page')));
			if($query->have_posts())
			{
				$query->the_post();
				ob_start();
				$found=FALSE;
				if($this->storage->templatesPath!=NULL)
				{
					if(file_exists($this->storage->templatesPath.'/post_content.tpl.php'))
					{
						$found=TRUE;
						include $this->storage->templatesPath.'/post_content.tpl.php';
					}
				}
				if(!$found)
				{
					include dirname(__FILE__).'/../../templates/wordpress/post_content.tpl.php';
				}
				$output=ob_get_clean();
				wp_reset_postdata();
				return $output;
			}
		}
	}
	
	public function isMetaType() {
		return TRUE;
	}
	
	public function metaTitle() {
		return t("Contents");
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
		$query=new WP_Query(array('post_type'=>array('post','page')));
		while($query->have_posts())
		{
			$query->the_post();
			$post=get_post();
			if(strstr($post->post_title, $search)!==FALSE)
			{
				$box=new grid_post_box();
				$box->content=new StdClass();
				$box->content->viewmode='excerpt';
				$box->content->postid=$post->ID;
				$results[]=$box;
			}
		}
		wp_reset_postdata();
		return $results;
	}
	
	public function contentStructure () {
		$params=array(
			array(
				'key'=>'viewmode',
				'type'=>'select',
				'label'=>'Ansicht',
				'selections'=>array(array('key'=>'excerpt','text'=>'Anriss'),array('key'=>'full','text'=>'Voll')),
			),
			array(
				'key'=>'postid',
				'type'=>'hidden',
			),
		);
		return $params;
	}

}