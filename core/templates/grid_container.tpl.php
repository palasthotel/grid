<?php // Open Content Container Wrapper
if ($this->firstcontentcontainer): ?>
<div class="content-container-wrapper C-8-0 first-content-container">
<?php endif; ?>


<div class="container <?=$this->style?> <?=$this->type?> <?=implode($this->classes," ")?> clearfix btcf">

	<div class="c-before">
		<?
		if ($this->title!=""){
			if ($this->titleurl !=""){
			?>
				<h2 class="c-title"><a href="<?=$this->titleurl?>"><?=$this->title?></a></h2>
			<?}else{?>
				<h2 class="c-title"><?=$this->title?></h2>
			<?}?>
		<?}?>
		<div class="c-prolog">
		  	<?=$this->prolog?>
		</div>
	</div>

	<div class="slots-wrapper clearfix">
	<?=implode("", $slots)?>
	</div>

	<div class="c-after">
		<div class="c-epilog">
			<?=$this->epilog?>
		</div>
		<? if ($this->readmore!=""){?>
		<a href="<?=$this->readmoreurl?>" class="c-readmore-link"><?=$this->readmore?></a>
		<?}?>
	</div>

</div>

<?php // Close Content Container Wrapper
if ($this->lastcontentcontainer): ?>
</div><!-- /.content-container-wrapper -->
<?php endif; ?>