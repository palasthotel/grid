<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
 * @package Palasthotel\Grid
 */
?>
<div class="grid-box-editmode">
  <?php if (is_string($content)): ?>
    RSS Feed
  <?php else: ?>
    <p><strong><?php echo $this->content->url; ?></strong></p>
    <ul>
      <?php foreach ($content as $item): ?>
        <li><?php echo $item->getTitle(); ?> </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>
</div>
