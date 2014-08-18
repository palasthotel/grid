<div class="box<?php echo ($this->style)? " ".$this->style." ": " "; echo implode($this->classes," ")?>">
	<?php
	if ($this->title!=""){

		if ($this->titleurl !=""){
		?>
			<h3 class="b-title"><a href="<?php echo $this->titleurl?>"><?php echo $this->title?></a></h3>
		<?php }else{?>
			<h3 class="b-title"><?php echo $this->title?></h3>
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
