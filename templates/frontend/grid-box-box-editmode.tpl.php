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
	if(is_string($content)){
		echo $content;
	} else if(is_object($content)) {
		echo $this->type();
		if(null != $this->grid){
			$vars = get_object_vars($content);
			foreach ($vars as $field => $value) {
				if(!empty($value)){
					echo "<br/><i>".$field.":</i> ";
					if(is_string($value) || is_numeric($value)){
						echo $value;
					} else {
						echo t("no working template for value");
					}
				}
			}
		}
	} else {
		echo t("There is no working editmode template");
	}
	?>
</div>
