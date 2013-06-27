/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.language = 'de';
	config.toolbar = [
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike'] },
		{ name: 'blockstyles', items: [  'NumberedList','BulletedList', 'Blockquote' ] },
	    { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
	    { name: 'document', items: [ 'Source' ] }
	];
};
