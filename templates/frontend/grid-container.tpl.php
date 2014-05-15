<?php
if ($this->firstcontentcontainer){

	if($this->space_to_right != null){
		$math = split("d", $this->space_to_right);
	} else {
		$math = split("d", $this->space_to_left);
	}
	$width = $math[1]-$math[0];
	$class = ($this->space_to_right)? "c-".$width."d".$math[1]."-0" : "c-0-".$width."d".$math[1];
?>
<div class="grid-content-container-wrapper <?= $class ?> grid-first-content-container">
<?php
}
?>

<div class="<?php echo ($this->style)? $this->style." ":""; echo implode($this->classes," "); ?>">
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

<?php
if ($this->lastcontentcontainer):
?>
</div>
<?php
endif; 
?>