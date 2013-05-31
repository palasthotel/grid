<div class="container_12 <?=$this->style?> clearfix">
	<div class="clearfix">
	<?
	if ($this->title!=""){
  ?>
  <a href="<?=$this->titleurl?>" class="region-title"><?=$this->title?></a>
	<?}?>
  
  <?=$this->prolog?>
	</div>
	<?=implode("", $slots)?>
	<div class="clearfix">
	<?
	if ($this->readmore!=""){?>
	<a href="<?=$this->readmoreurl?>"><?=$this->readmore?></a>
	<?}?>
	<?=$this->epilog?>
	</div>
</div>