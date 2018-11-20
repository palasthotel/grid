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
	  echo preg_replace('#<script(.*?)>(.*?)</script>#is', '', $this->content->html);
  }
  ?>
</div>
