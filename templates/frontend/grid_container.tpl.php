<?php // Open Content Container Wrapper
/*
if ($this->firstcontentcontainer): 
	$class = ($this->sidebarleft)? "C-0-8": "C-8-0";
?>
<div class="grid-content-container-wrapper <?= $class ?> grid-first-content-container">
<?php endif; ?>
*/
$class_prefix="grid-container";
$container_classes = $class_prefix;
$container_classes.= " ".$class_prefix."-type-".$this->type;
$container_classes.= " ".$class_prefix."-".$this->dimension;
$container_classes.= " ".implode($this->classes," ");
?>

<div class="<?php echo $container_classes; ?>">
	<div class="grid-container-content">
	<div class="grid-container-before">
		<?
		if ($this->title!=""){
			if ($this->titleurl !=""){
			?>
				<h2 class="grid-container-title"><a href="<?=$this->titleurl?>"><?=$this->title?></a></h2>
			<?}else{?>
				<h2 class="grid-container-title"><?=$this->title?></h2>
			<?}?>
		<?}?>
		<div class="grid-container-prolog">
		  	<?=$this->prolog?>
		</div>
	</div>

	<div class="grid-slots-wrapper clearfix">
	<?=implode("", $slots)?>
	</div>

	<div class="grid-container-after">
		<div class="grid-container-epilog">
			<?=$this->epilog?>
		</div>
		<? if ($this->readmore!=""){?>
		<a href="<?=$this->readmoreurl?>" class="grid-container-readmore-link"><?=$this->readmore?></a>
		<?}?>
	</div>
	</div>

</div>

<?php // Close Content Container Wrapper
/*
if ($this->lastcontentcontainer): ?>
</div><!-- /.content-container-wrapper -->
<?php endif; ?>
*/
?>