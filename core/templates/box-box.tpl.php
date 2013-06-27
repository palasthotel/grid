<div class="<?=$this->style?>">
<?
if ($this->title!=""){
  if ($this->titleurl !=""){
  ?>
	<a href="<?=$this->titleurl?>" class="box-title"><?=$this->title?></a>
	<?}else{?>
	<h3><?=$this->title?></h3>
	<?}?>
	<?}?>
	<?=$this->prolog?>
	
	<?=$content?>

  <?
	if ($this->readmore!=""){?>
	<a href="<?=$this->readmoreurl?>"><?=$this->readmore?></a>
	<?}?>
	<?=$this->epilog?>
</div>