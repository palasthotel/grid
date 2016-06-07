
<div class="grid-box-editmode">
  <?php
  if(is_string($content)){
	?>RSS Feed<?php
  } else {
  ?>
  	<p><strong><?php echo  $this->content->url; ?></strong></p>
  	<ul>
	<?php
	foreach($content as $item){
	  echo "<li>".$item->getTitle()."</li>";
	}
	?>
	</ul>
  <?php
  }
  ?>

</div>