<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
?>
<div class="grid grid-frontend clearfix">
  <?php if (!empty($containerlist)): ?>
    <?php echo implode("\n", $containerlist); ?>
  <?php endif; ?>
</div>
