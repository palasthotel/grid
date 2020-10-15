<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
<div class="grid-box-editmode">
  <?php
  if( empty($this->content->html)) {
	  echo t("Static HTML-Content");
  } else {

	  $maybeHtml = $this->content->html;
	  $start =strpos($maybeHtml, '<');
	  $end  =strrpos($maybeHtml, '>',$start);

	  $len=strlen($maybeHtml);

	  if ($end !== false) {
		  $string = substr($maybeHtml, $start);
	  } else {
		  $string = substr($maybeHtml, $start, $len-$start);
	  }
	  libxml_use_internal_errors(true);
	  libxml_clear_errors();

	  $htmlEntitiesDecoded = html_entity_decode($maybeHtml);
	  $encodeAmpersandAgain = str_replace("&","&amp;", $htmlEntitiesDecoded);

	  $xml = simplexml_load_string("<div>".$encodeAmpersandAgain."</div>");
	  $isValidHtml = count(libxml_get_errors())==0;

	  if(!$isValidHtml){
		  echo "<p><strong>It seems your html is not valid.</strong> ⚠️</p>";
		  echo "<pre>";
		  var_dump(libxml_get_errors());
		  echo "</pre>";
		  echo "<code>";
		  echo htmlspecialchars(preg_replace('#<script(.*?)>(.*?)</script>#is', '', $this->content->html));
		  echo "</code>";
	  } else {
		  echo preg_replace('#<script(.*?)>(.*?)</script>#is', '', $this->content->html);
	  }
  }
  ?>
</div>
