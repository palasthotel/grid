<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
 
if ($this->firstcontentcontainer){

	if($this->space_to_right != null){
		$math = explode("d", $this->space_to_right);
	} else {
		$math = explode("d", $this->space_to_left);
	}
	$width = $math[1]-$math[0];
	$class = ($this->space_to_right)? "c-".$width."d".$math[1]."-0" : "c-0-".$width."d".$math[1];
	$class = "grid-container-".$class;
	$str = "grid-container-right-space-".$this->space_to_right;
	$stl = "grid-container-left-space-".$this->space_to_left
?>
<div class="grid-content-container-wrapper <?php echo $class." ".$str." ".$stl; ?> grid-first-content-container">
<?php
}
?>

<div class="<?php echo ($this->style)? $this->style." ":""; echo implode($this->classes," "); ?> grid-container-type-<?php echo $this->type_id;?>">
	<div class="grid-container-content">
	<div class="grid-container-before">
		<?php
		if ($this->title!=""){
			if ($this->titleurl !=""){
			?>
				<h2 class="grid-container-title"><a href="<?php echo $this->titleurl?>"><?php echo $this->title?></a></h2>
			<?php }else{?>
				<h2 class="grid-container-title"><?php echo $this->title?></h2>
			<?php }?>
		<?php }?>

		<?php if($this->prolog != "") { ?>
		<div class="grid-container-prolog">
		  	<?php echo $this->prolog?>
		</div>
		<?php } ?>

	</div>

	<div class="grid-slots-wrapper">
	<?php 
	// important for reuse containers list
	if(isset($slots) && is_array($slots))
	{
		echo implode("", $slots);
	}
	?>
	</div>

	<div class="grid-container-after">

		<?php if($this->epilog != ""){ ?>
		<div class="grid-container-epilog">
			<?php echo $this->epilog?>
		</div>
		<?php } ?>

		<?php if ($this->readmore!=""){?>
		<a href="<?php echo $this->readmoreurl?>" class="grid-container-readmore-link"><?php echo $this->readmore?></a>
		<?php }?>
		
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
