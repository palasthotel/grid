<?php 
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
<div class="box<?php echo ($this->style)? " ".$this->style." ": " "; echo implode($this->classes," ")?>">
	<?php
	if ($this->title!=""){

		if ($this->titleurl !=""){
		?>
			<h2 class="b-title"><a href="<?php echo $this->titleurl?>"><?php echo $this->title?></a></h2>
		<?php }else{?>
			<h2 class="b-title"><?php echo $this->title?></h2>
		<?php }?>
	<?php }?>
	<div class="b-prolog">
		<?php echo $this->prolog?>
	</div>
	
	<?php echo $content?>
	<div class="b-epilog">
		<?php echo $this->epilog?>
	</div>
  	<?php
	if ($this->readmore!=""){?>
	<a href="<?php echo $this->readmoreurl?>" class="b-readmore-link"><?php echo $this->readmore?></a>
	<?php }?>
	
</div>
