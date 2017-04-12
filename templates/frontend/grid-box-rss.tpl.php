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
<div class="<?php echo implode($classes, ' '); ?>">
  <?php if (!empty($this->title)): ?>
    <?php if (!empty($this->titleurl)): ?>
       <h2 class="grid-box-title b-title">
         <a href="<?php echo $this->titleurl; ?>"><?php echo $this->title; ?></a>
       </h2>
    <?php else: ?>
      <h2 class="grid-box-title b-title"><?php echo $this->title; ?></h2>
    <?php endif; ?>
  <?php endif; ?>

  <?php if (!empty($this->prolog)): ?>
    <div class="grid-box-prolog b-prolog">
      <?php echo $this->prolog; ?>
    </div>
  <?php endif; ?>

  <ul class="grid-rss-items">
    <?php
    if (is_string($content)) {
      // nothing selected
    }
    else if (is_array($content) && count($content) > 0) {
      foreach ($content as $item) {
        /**
         * @var grid_rss_box_item $item
         */
        ?>
          <li class="<?php echo implode(' ', $item->getClasses()); ?>"><a href="<?php echo $item->getPermalink(); ?>"><?php echo $item->getDate("d.M.Y - H:i") . '<br>' . $item->getTitle() . '<br>' . $item->getDescription(); ?></a></li>
        <?php
      }
    }
    ?>
  </ul>

  <?php if (!empty($this->epilog)): ?>
    <div class="grid-box-epilog b-epilog">
      <?php echo $this->epilog; ?>
    </div>
  <?php endif; ?>

  <?php if (!empty($this->readmore)): ?>
    <a href="<?php echo $this->readmoreurl; ?>" class="grid-box-readmore-link b-readmore-link"><?php echo $this->readmore; ?></a>
  <?php endif; ?>
</div>
