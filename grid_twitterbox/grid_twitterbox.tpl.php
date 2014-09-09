<?php 
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */
?>
<?
	foreach($content as $tweet) {
?>
<div>
	<?php echo '--<br />'.$tweet->text?>
</div>
<?
	}
?>