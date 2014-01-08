<?php

class grid_fb_like_box_box extends grid_static_base_box {
	
	public function type()
	{
		return 'fb_like_box';
	}

	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->fb_user='';
		$this->content->show_faces = "TRUE";
	}

	public function build($editmode) {
		if($editmode)
		{
			return t("Facebook Like Box");
		}
		else
		{
			$fb_user = $this->content->fb_user;
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
			data-href="http://www.facebook.com/<?= $fb_user; ?>" 
			data-colorscheme="light" 
			data-show-faces="<?= $show_faces; ?>" 
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
				'key'=>'fb_user',
				'label'=>t('Facebook Account'),
				'type'=>'text'
			),
			array(
				'key' => 'category',
				'label' => t('Category'),
				'type' => 'select',
				'selections'=>
				array(
					array(
						"key" => "TRUE",
						"text" => t("show"),
					),
					array(
						"key" => "FALSE",
						"text" => t("hide"),
					),
				),
			),
		);
	}

}
