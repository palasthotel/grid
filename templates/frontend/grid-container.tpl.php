<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 *
 * @var \grid_container $this
 */

$classes = $this->classes;

if (!empty($this->type_id)) {
  array_push($classes, 'grid-container-type-' . $this->type_id);
}

if (!empty($this->style)) {
  array_push($classes, $this->style);
}

if (!empty($this->title)) {
  array_push($classes, 'has-title');
}

$hasSpaceAround = false;
if ($this->space_to_right != NULL) {
	$hasSpaceAround = true;
	$classes[] = "grid-container-right-space-".$this->space_to_right;
}
if($this->space_to_left != NULL) {
	$hasSpaceAround = true;
	$classes[] = "grid-container-left-space-".$this->space_to_left;
}
if($hasSpaceAround){
	$classes[] = "grid-container-has-space-around";
}
?>

  <div class="<?php echo implode($classes, ' '); ?>">
    <div class="grid-container-content">
      <div class="grid-container-before">
        <?php if (!empty($this->title)): ?>
          <?php if (!empty($this->titleurl)): ?>
            <h2 class="grid-container-title"><a href="<?php echo $this->titleurl; ?>" class="grid-container-title-link grid-container-title-text"><?php echo $this->title; ?></a></h2>
          <?php else: ?>
            <h2 class="grid-container-title grid-container-title-text"><?php echo $this->title; ?></h2>
          <?php endif; ?>
        <?php endif; ?>

        <?php if (!empty($this->prolog)): ?>
          <div class="grid-container-prolog">
            <?php echo $this->prolog; ?>
          </div>
        <?php endif; ?>
      </div>

      <div class="grid-slots-wrapper">
        <?php
        // Important for reuse containers list
        if (isset($slots) && is_array($slots) && count($slots) > 0) {
          echo implode("\n", $slots);
        }
        ?>
      </div>

      <div class="grid-container-after">
        <?php if (!empty($this->epilog)): ?>
          <div class="grid-container-epilog">
            <?php echo $this->epilog; ?>
          </div>
        <?php endif; ?>

        <?php if (!empty($this->readmore)): ?>
          <a href="<?php echo $this->readmoreurl; ?>" class="grid-container-readmore-link"><?php echo $this->readmore; ?></a>
        <?php endif; ?>
      </div>
    </div>
  </div>

