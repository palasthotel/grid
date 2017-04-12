<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

$classes = $this->classes;
array_push($classes, 'grid-slot');

if (!empty($this->dimension)) {
  array_push($classes, 'grid-slot-' . $this->dimension);
}

if (!empty($this->style)) {
  array_push($classes, $this->style);
}

?>
<div class="<?php echo implode($classes, ' '); ?>">
  <?php if (!empty($boxes)) : ?>
    <div class="grid-boxes-wrapper">
      <?php echo implode("\n", $boxes); ?>
    </div>
  <?php endif; ?>
</div>
