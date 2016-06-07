
<div class="grid-box<?php echo ($this->style)? " ".$this->style." ": " "; echo implode($this->classes," ")?>">
  <?php
  if ($this->title!=""){

	if ($this->titleurl !=""){
	  ?>
	  <h2 class="grid-box-title b-title"><a href="<?php echo $this->titleurl?>"><?php echo $this->title?></a></h2>
	<?php }else{?>
	  <h2 class="grid-box-title b-title"><?php echo $this->title?></h2>
	<?php }?>
  <?php }?>

  <?php if($this->prolog != "") { ?>
	<div class="grid-box-prolog b-prolog">
	  <?php echo $this->prolog?>
	</div>
  <?php } ?>

  <ul class="grid-rss-items">
	<?php
	foreach($content as $item){
	  /**
	   * @var grid_rss_box_item $item
	   */
	  ?>
	  <li class="<?php echo implode(" ", $item->getClasses()); ?>"><a href="<?php
		echo $item->getPermalink();
		?>"><?php
		  echo $item->getDate("d.M.Y - H:i")."<br>";
		  echo $item->getTitle()."<br>";
		  echo $item->getDescription()
		  ?></a></li>
	  <?php
	}
	?>
  </ul>

  <?php if($this->epilog != ""){ ?>
	<div class="grid-box-epilog b-epilog">
	  <?php echo $this->epilog?>
	</div>
  <?php } ?>

  <?php
  if ($this->readmore!=""){?>
	<a href="<?php echo $this->readmoreurl?>" class="grid-box-readmore-link b-readmore-link"><?php echo $this->readmore?></a>
  <?php }?>

</div>





