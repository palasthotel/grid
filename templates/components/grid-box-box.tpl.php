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

if (!empty($this->title)) {
  array_push($classes, 'has-title');
}

?>
<div class="<?php echo implode( ' ', $classes); ?>">
  <?php if (!empty($this->title)): ?>
    <?php if (!empty($this->titleurl)): ?>
      <h2 class="grid-box-title b-title"><a class="grid-box-title-link grid-box-title-text" href="<?php echo $this->titleurl; ?>"><?php echo $this->title; ?></a></h2>
    <?php else: ?>
      <h2 class="grid-box-title grid-box-title-text b-title"><?php echo $this->title; ?></h2>
    <?php endif; ?>
  <?php endif; ?>

  <?php if (!empty($this->prolog)): ?>
    <div class="grid-box-prolog b-prolog">
      <?php echo $this->prolog; ?>
    </div>
  <?php endif; ?>

  <?php if (is_string($content)): ?>
    <?php echo $content; ?>
  <?php else: ?>
    <p><?php echo t("There is no working template for this Box."); ?></p>
  <?php endif; ?>

  <?php if (!empty($this->epilog)): ?>
    <div class="grid-box-epilog b-epilog">
      <?php echo $this->epilog; ?>
    </div>
  <?php endif; ?>

  <?php if (!empty($this->readmore)): ?>
    <a href="<?php echo $this->readmoreurl; ?>" class="grid-box-readmore-link b-readmore-link"><?php echo $this->readmore; ?></a>
  <?php endif; ?>
</div>
