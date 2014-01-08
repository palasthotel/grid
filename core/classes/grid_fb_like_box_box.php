<?php

class grid_fb_like_box_box extends grid_static_base_box {
	
	public function type()
	{
		return 'fb_like_box';
	}

	public function __construct()
	{
		$this->content=new Stdclass();
		$this->content->fb_page='';
		$this->content->show_faces = "true";
		$this->content->show_header = "true";
		$this->content->datastream = "false";
		$this->content->colorscheme = "light";
		$this->content->show_border = "true";
	}

	public function build($editmode) {
		if($editmode)
		{
			return t("Facebook Like Box");
		}
		else
		{
			$fb_page = $this->content->fb_page;
			$show_faces = $this->content->show_faces;
			$show_header = $this->content->show_header;
			$datastream = $this->content->datastream;
			$colorscheme = $this->content->colorscheme;
			$show_border = $this->content->show_border;

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
			data-href="http://www.facebook.com/<?= $fb_page; ?>" 
			data-colorscheme="<?= $colorscheme; ?>" 
			data-show-faces="<?= $show_faces; ?>" 
			data-header="<?= $show_header; ?>" 
			data-stream="<?= $datastream; ?>" 
			data-show-border="<?= $show_border; ?>"></div>


			<?php
			$output = ob_get_contents();
			ob_end_clean();
			return $output;
		}
	}
	
	public function contentStructure () {
		return array(
			array(
				'key'=>'fb_page',
				'label'=>t('Facebook page'),
				'type'=>'text'
			),
			array(
				'key' => 'colorscheme',
				'label' => t('Color scheme'),
				'type' => 'select',
				'selections'=>
				array(
					array(
						"key" => "light",
						"text" => t("light"),
					),
					array(
						"key" => "dark",
						"text" => t("dark"),
					),
				),
			),
			array(
				'key' => 'show_faces',
				'label' => t('Faces'),
				'type' => 'select',
				'selections'=>
				array(
					array(
						"key" => "true",
						"text" => t("show"),
					),
					array(
						"key" => "false",
						"text" => t("hide"),
					),
				),
			),
			array(
				'key' => 'show_header',
				'label' => t('Box header'),
				'type' => 'select',
				'selections'=>
				array(
					array(
						"key" => "true",
						"text" => t("show"),
					),
					array(
						"key" => "false",
						"text" => t("hide"),
					),
				),
			),
			array(
				'key' => 'datastream',
				'label' => t('Stream of latest posts'),
				'type' => 'select',
				'selections'=>
				array(
					array(
						"key" => "true",
						"text" => t("show"),
					),
					array(
						"key" => "false",
						"text" => t("hide"),
					),
				),
			),
			array(
				'key' => 'show_border',
				'label' => t('Border of box'),
				'type' => 'select',
				'selections'=>
				array(
					array(
						"key" => "true",
						"text" => t("show"),
					),
					array(
						"key" => "false",
						"text" => t("hide"),
					),
				),
			),
			array(
				'key' => 'width',
				'label' => t('Width in pixel (optional, default 300)'),
				'type' => 'number',
			),
			array(
				'key' => 'height',
				'label' => t('Height in pixel(optional, default 556 or 63 without stram and faces)'),
				'type' => 'number',
			)
		);
	}

}
