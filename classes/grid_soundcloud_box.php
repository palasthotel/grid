<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/**
* Soundcloud-Box is considered an abstract list
*/
class grid_soundcloud_box extends grid_static_base_box {

    /**
    * Sets box type
    *
    * @return string
    */
    public function type() {
        return 'soundcloud';
    }

    /**
    * Class contructor
    *
    * Initializes editor widgets for backend
    */
    public function __construct() {
        parent::__construct();
        $this->content->url= "";
        $this->content->color = "";
        $this->content->height = 200;
    }

    /**
    * Box renders its menu label and its content in here.
    *
    * @return boolean
    */
    public function build($editmode) {
        if($editmode) {
            return $this->content;
        }
        else {
            // KM added support for IE9 and below
            $url = $this->content->url;

            if (empty($this->content->url)) {
                return "<p>" . t("Please provide a Soundcloud URL") . "</p>";
            }

            $iframe_maxheight = 200;
            $oembed_maxheight = 81;
            if(!empty($this->content->height)){
                $iframe_maxheight = $this->content->height;
            }

            
            // Soundcloud playlist needs more vertical space
            if (strpos($url, '/sets/') !== false) {
                if($iframe_maxheight < 300){
                    $iframe_maxheight = 300;
                }
                $oembed_maxheight = 300;
            }

            $query_iframe = "&format=json&maxheight=$iframe_maxheight&auto_play=false";
            $query_oembed = "&format=json&maxheight=$oembed_maxheight&auto_play=false&iframe=false";
            
            if ($this->content->color != "" && strlen($this->content->color) == 6) {
                $request_iframe .=  "&color=" . $this->content->color;
                $request_oembed .=  "&color=" . $this->content->color;
            }

            $request_url_iframe = "https://soundcloud.com/oembed?url=" . urlencode($this->content->url . $query_iframe);
            $request_url_oembed = "https://soundcloud.com/oembed?url=" . urlencode($this->content->url . $query_oembed);
            
            $return_iframe = $this->executeRequest($request_url_iframe);
            $return_oembed = $this->executeRequest($request_url_oembed);

            if (empty($return_iframe) || empty($return_oembed)) {
                return "<p>" . t("Please provide a valid Soundcloud URL") . "</p>";
            }

            $json_iframe = json_decode($return_iframe);
            $json_oembed = json_decode($return_oembed);

            $html_iframe = $json_iframe->html;
            $html_oembed = $json_oembed->html;

            return <<<EOT
<!--[if gt IE 9]><!-->
$html_iframe
<!--<![endif]-->
<!--[if lte IE 9]>
$html_oembed
<![endif]-->
EOT;
        }
    }
    
    private function executeRequest($url){
	    $curl = curl_init($url);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
	    $content = curl_exec($curl);
	    curl_close($curl);
	    return $content;
    }

    /**
    * Determines editor widgets used in backend
    *
    * @return array
    */
    public function contentStructure () {
        $cs = parent::contentStructure();
        return array_merge($cs, array(
            array(
                'key'=>'url',
                'label'=>t('URL'),
                'type'=>'text'
            ),
            array(
                'key'=>'height',
                'label'=>t('Height'),
                'type'=>'number',
            ),
            array(
                'key'=>'color',
                'label'=>t('Hex Color #[...] (optional)'),
                'type'=>'text',
            ),
        ));
    }

}
