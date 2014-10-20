<?php 
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
<div class="grid-slot grid-slot-<?php echo $this->dimension; echo ($this->style)? " ".$this->style." ":" "; echo implode($this->classes," ");?>">
	<div class="grid-boxes-wrapper">
		<?php echo implode("", $boxes)?>
	</div>
</div>
