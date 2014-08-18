
<div class="grid-slot grid-slot-<?php echo $this->dimension; echo ($this->style)? " ".$this->style." ":" "; echo implode($this->classes," ");?>">
	<div class="grid-boxes-wrapper">
		<?php echo implode("", $boxes)?>
	</div>
</div>
