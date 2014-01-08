<?php

class grid_fb_like_box_box extends grid_static_base_box {
	
	public function type()
	{
		return 'fb_like_box';
	}

	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->html='';
		$this->content->show_faces = "TRUE";
	}

	public function build($editmode) {
		if($editmode)
		{
			return t("Facebook Like Box");
		}
		else
		{
			$show_faces = $this->content->show_faces;
			ob_start();
			?>
			<script>
			(function(d, s, id) {
			  if (d.getElementById(id)) return;
			  div = d.createElement(s); 
			  div.id = id;
			  d.body.insertBefore(div, document.body.childNodes[0]);
			}(document, 'div', 'fb-root'));
			(function(d, s, id) {
			  var js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return;
			  js = d.createElement(s); js.id = id;
			  js.src = "//connect.facebook.net/de_DE/all.js#xfbml=1";
			  fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
			</script>
			
			<div 
			class="fb-like-box" 
			data-href="http://www.facebook.com/FacebookDevelopers" 
			data-colorscheme="light" 
			data-show-faces="true" 
			data-header="true" 
			data-stream="true" 
			data-show-border="true"></div>


			<?php
			$output = ob_get_contents();
			ob_end_clean();
			return $output;
		}
	}
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'html',
				'label'=>t('Text'),
				'type'=>'html'
			),
		);
	}

}
