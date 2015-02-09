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
	if ($this->title!=""){
		echo '<h2 class="b-title">'.$this->title.'</h2>';
	}
	if(is_string($content)){
		echo "<div class='content'>".$content."</div>";
	} else {
		echo "<div class='content'>".t("There is no working editmode template")."</div>";
	}
	
	?>
</div>
