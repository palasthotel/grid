<?php 
/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/
header('Content-Type: application/javascript'); 
?>

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

	config.format_tags = '<?=implode(";",$formats)?>';
	<?php if(count($styles)>0) {?>
	config.stylesSet = 'grid_styles';
    <?php } ?>
};
