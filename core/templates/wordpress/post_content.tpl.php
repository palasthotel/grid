<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */
?>
<h3><?php echo the_title(); ?></h3>
<?php
if ( 'full' == $this->content->viewmode ) {
	echo the_content();
} elseif ( 'excerpt' == $this->content->viewmode ) {
	echo the_excerpt();
}
?>
