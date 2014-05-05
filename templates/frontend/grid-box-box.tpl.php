<div class="box<?php echo ($this->style)? " ".$this->style." ": " "; echo implode($this->classes," ")?>">
	<?
	if ($this->title!=""){

		if ($this->titleurl !=""){
		?>
			<h3 class="b-title"><a href="<?=$this->titleurl?>"><?=$this->title?></a></h3>
		<?}else{?>
			<h3 class="b-title"><?=$this->title?></h3>
		<?}?>
	<?}?>
	<div class="b-prolog">
		<?=$this->prolog?>
	</div>
	
	<?=$content?>
	<div class="b-epilog">
		<?=$this->epilog?>
	</div>
  	<?
	if ($this->readmore!=""){?>
	<a href="<?=$this->readmoreurl?>" class="b-readmore-link"><?=$this->readmore?></a>
	<?}?>
	
</div>