<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
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