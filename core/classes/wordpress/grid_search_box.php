<?php

class grid_posts_box extends grid_static_base_box {
	
	function __construct() {
		$this->content=new Stdclass();
	}
	
	public function type()
	{
		return 'wp-search';
	}
	
	public function build($editmode) {
		if($editmode)
		{
			return t('WP Search');
		}
		else
		{
			$args=array();
			if(isset($this->content->category) && $this->content->category!='')
				$args['cat']=$this->content->category;
			$args['posts_per_page']=$this->content->posts_per_page;
			$args['offset']=$this->content->offset;
			$args['post_type']=$this->content->post_type;
			$output='';
			$query=new WP_Query($args);
			while($query->have_posts())
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
				$output.=ob_get_clean();

			}
			wp_reset_postdata();
			return $output;
		}
	}
		
	public function contentStructure() {
		$post_types=array();
		$input=get_post_types(array(),'objects');
		foreach($input as $post_type=>$info)
		{
			$post_types[]=array('key'=>$post_type,'text'=>$info->labels->name);
		}
		return array(
			array(
				'key'=>'viewmode',
				'type'=>'select',
				'label'=> t('Viewmode'),
				'selections'=>array(array('key'=>'excerpt','text'=>'Anriss'),array('key'=>'full','text'=>'Voll')),
			),
			array(
				'key'=>'posts_per_page',
				'label'=>t('Posts per page'),
				'type'=>'number',
			),
			array(
				'key'=>'offset',
				'label'=>t('Offset'),
				'type'=>'number',
			),
			array(
				'key'=>'category',
				'label'=>t('Category'),
				'type'=>'autocomplete'
			),
			array(
				'key'=>'post_type',
				'label'=>t('Post type'),
				'type'=>'select',
				'selections'=>$post_types,
			),
		);
	}

	public function performElementSearch($key,$query)
	{
		if($key!='category')
			return array(array('key'=>-1,'value'=>'invalid key'));
		$categories=get_categories();
		$result=array();
		$result[]=array('key'=>100,'value'=>'Helper to check');
		foreach($categories as $category)
		{
			if($query=='' || strstr($category->name, $query)!==FALSE)
			{
				$results[]=array('key'=>$category->term_id,'value'=>$category->name);
			}
		}
		return $results;
	}

	public function getElementValue($path,$id)
	{
		if($path!='category')
		{
			return '';
		}
		else
		{
			$thisCat=get_category($id);
			return $thisCat->name;
		}
	}
}