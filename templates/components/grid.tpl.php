<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
 * @package Palasthotel\Grid
 */
?>
<div class="grid grid-frontend clearfix">
  <?php if (!empty($containerlist)): ?>
    <?php echo implode("\n", $containerlist); ?>
  <?php endif; ?>
</div>
