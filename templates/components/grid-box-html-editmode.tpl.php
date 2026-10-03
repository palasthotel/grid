<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
 * @package Palasthotel\Grid
 */
?>
<div class="grid-box-editmode">
  <?php
  if (empty($this->content->html)) {
    echo t("Static HTML-Content");
  } else {
    // Prevent malformed HTML code:
    $maybeHtml = $this->content->html;
    libxml_use_internal_errors(true);
    libxml_clear_errors();
    $dom = new DOMDocument();
    $dom->loadHTML("<?xml encoding=\"UTF-8\"><!DOCTYPE html><html><body>$maybeHtml</body>");
    $errors = libxml_get_errors();
    if (!empty($errors)) {
      echo "<p><strong>It seems your html is not valid.</strong> ⚠️</p>";
      echo "<pre>";
      var_dump($errors);
      echo "</pre>";
      echo "<code>";
      echo htmlspecialchars(preg_replace('#<script(.*?)>(.*?)</script>#is', '', $this->content->html));
      echo "</code>";
    } else {
      echo preg_replace('#<script(.*?)>(.*?)</script>#is', '', $this->content->html);
    }
  }
  ?>
</div>
