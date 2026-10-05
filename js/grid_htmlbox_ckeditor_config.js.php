<?php
/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/
header('Content-Type: application/javascript');
?>
if(typeof CKEDITOR !== typeof undefined){
  /*
 CKEDITOR.stylesSet.add( 'grid_styles',
 [
 // Block-level styles
 { name : 'Blue Title', element : 'h2', styles : { 'color' : 'Blue' } },
 { name : 'Red Title' , element : 'h3', styles : { 'color' : 'Red' } },

 // Inline styles
 { name : 'CSS Style', element : 'span', attributes : { 'class' : 'my_style' } },
 { name : 'Marker: Yellow', element : 'span', styles : { 'background-color' : 'Yellow' } }
 ]);
 */
  CKEDITOR.stylesSet.add( 'grid_styles',
    [
      // Block-level styles
      <?php
      $tmp=array();
      foreach($styles as $style)
      {
        $tmp[]=json_encode($style);
      }
      echo implode(",", $tmp);
      ?>
      //{ name : 'Fett', element : 'h2', attributes : { 'class' : 'emm-headline-bold' } },
      //{ name : 'Mittel' , element : 'p', attributes : { 'class' : 'emm-medium' } }
    ]);
  <?php
  $items=array();
  if(count($styles)>0)
  {
    $items[]="Styles";
  }
  if(count($formats)>0)
  {
    $items[]="Format";
  }
  if(!in_array("p",$formats))
  {
    $formats[]="p";
  }

  /**
   * add external ckeditor plugins
   */
  foreach($ckeditor_plugins as $slug => $path){
    echo "CKEDITOR.plugins.addExternal(".json_encode((string)$slug).", ".json_encode((string)$path).");";
  }
  ?>

  CKEDITOR.editorConfig = function( config ) {
    config.language = 'de';
    config.toolbar = [
      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor']},
      { name: "format", items: <?=json_encode($items)?>},

      { name: 'blockstyles', items: [  'NumberedList','BulletedList', 'Blockquote' ] },
      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
      { name: 'document', items: [ 'Source' ] }
    ];

    config.allowedContent = true;

    // 4.22 is the last open-source CKEditor 4; its version check would tell editors to buy the LTS
    config.versionCheck = false;

    config.format_tags = '<?=implode(";",$formats)?>';
    <?php if(count($styles)>0) {?>
    config.stylesSet = 'grid_styles';
    <?php } ?>

    <?php
    /**
     *load external plugins for ckeditor
     */
    if(count($ckeditor_plugins)>0)
    {
      echo "config.extraPlugins = ".json_encode(implode(",", array_map("strval", array_keys($ckeditor_plugins)))).";";
    }
    ?>

  };


}
