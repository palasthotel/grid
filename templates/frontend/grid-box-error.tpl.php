<?php 
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
<div class="box<?php echo ($this->style)? " ".$this->style." ": " "; echo implode($this->classes," ")?>">
	<?php echo $content; ?>	
</div>
