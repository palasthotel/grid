/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
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
    { name : 'Fett', element : 'h2', attributes : { 'class' : 'emm-headline-bold' } },
    { name : 'Mittel' , element : 'p', attributes : { 'class' : 'emm-medium' } }
]);


CKEDITOR.editorConfig = function( config ) {
	config.language = 'de';
	config.toolbar = [
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike'] },

		{ name: "format", items: ['Styles', 'Format']},
		
		{ name: 'blockstyles', items: [  'NumberedList','BulletedList', 'Blockquote' ] },
	    { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
	    { name: 'document', items: [ 'Source' ] }
	];

	config.format_tags = 'h2;p';
	config.stylesSet = 'grid_styles';

};
