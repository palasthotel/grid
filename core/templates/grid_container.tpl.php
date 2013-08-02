<div class="container <?=$this->style?> <?=$this->type?> clearfix">
	<div class="clearfix">
	<?
	if ($this->title!=""){
  ?>
  <a href="<?=$this->titleurl?>" class="region-title"><?=$this->title?></a>
	<?}?>
  
  <?=$this->prolog?>
	</div>
	<div class="slots-wrapper">
	<?=implode("", $slots)?>
	</div>
	<div class="clearfix">
	<?=$this->epilog?>
	<?
	if ($this->readmore!=""){?>
	<a href="<?=$this->readmoreurl?>"><?=$this->readmore?></a>
	<?}?>
	</div>
</div>