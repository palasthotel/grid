<div class="<?=$this->style?>">
<?
if ($this->title!=""){
  ?>
	<a href="<?=$this->titleurl?>" class="box-title"><?=$this->title?></a>
	<?}?>
	<?=$this->prolog?>
	<?=$content?>
	<?
	if ($this->readmore!=""){?>
	<a href="<?=$this->readmoreurl?>"><?=$this->readmore?></a>
	<?}?>
	<?=$this->epilog?>
</div>