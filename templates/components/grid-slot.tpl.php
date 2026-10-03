<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
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
<div class="<?php echo implode( ' ', $classes); ?>">
  <?php if (!empty($boxes)) : ?>
    <div class="grid-boxes-wrapper">
      <?php echo implode("\n", $boxes); ?>
    </div>
  <?php endif; ?>
</div>
