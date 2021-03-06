<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

$classes = $this->classes;
array_push($classes, 'grid-box');

if ($this->style) {
  array_push($classes, $this->style);
}

?>
<div class="<?php echo implode(' ', $classes); ?>">
  <?php echo $content; ?>
</div>
