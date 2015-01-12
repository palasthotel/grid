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
        $this->content=new Stdclass();
        $this->content->url= "";
        $this->content->color = "";
    }

    /**
    * Box renders its menu label and its content in here.
    *
    * @return boolean
    */
    public function build($editmode) {
        if($editmode) {
            return t("Soundcloud").": ".$this->content->url;
        }
        else {
            // KM added support for IE9 and below
            $url = $this->content->url;

            if (empty($this->content->url)) {
                return "<p>" . t("Please provide a Soundcloud URL") . "</p>";
            }

            $iframe_maxheight = 200;
            $oembed_maxheight = 81;
            // Soundcloud playlist needs more vertical space
            if (strpos($url, '/sets/') !== false) {
              $iframe_maxheight = 300;
              $oembed_maxheight = 300;
            }

            $query_iframe = "&format=json&maxheight=$iframe_maxheight&auto_play=false&url=$url";
            $query_oembed = "&format=json&maxheight=$oembed_maxheight&auto_play=false&url=$url&iframe=false";

            $request_url_iframe = "http://soundcloud.com/oembed?url=" . $this->content->url . $query_iframe;
            $request_url_oembed = "http://soundcloud.com/oembed?url=" . $this->content->url . $query_oembed;

            if ($this->content->color != "" && strlen($this->content->color) == 6) {
                $request_url_iframe .=  "&color=" . $this->content->color;
                $request_url_oembed .=  "&color=" . $this->content->color;
            }

            // First request with iframe format:
            $curl_iframe = curl_init($request_url_iframe);
            curl_setopt($curl_iframe, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl_iframe, CURLOPT_TIMEOUT, 30);
            $return_iframe = curl_exec($curl_iframe);
            curl_close($curl_iframe);

            // Second request without iframe format for ie9 and below
            $curl_oembed = curl_init($request_url_oembed);
            curl_setopt($curl_oembed, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl_oembed, CURLOPT_TIMEOUT, 30);
            $return_oembed = curl_exec($curl_oembed);
            curl_close($curl_oembed);

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

    /**
    * Determines editor widgets used in backend
    *
    * @return array
    */
    public function contentStructure () {
        return array(
            array(
                'key'=>'url',
                'label'=>t('URL'),
                'type'=>'text'
            ),
            array(
                'key'=>'color',
                'label'=>t('Hex Color #[...] (optional)'),
                'type'=>'text'
            ),
        );
    }

}
