<?php
/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/
header('Content-Type: application/javascript');
?>
window.GridCKEditorConfig = {
  minHeight: '300px',
  toolbar:{
    items: [ 'heading', '|', 'bold', 'italic', 'blockQuote', 'link', '|', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'insertTable'],
  },
  table: {
    contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
  }
}
