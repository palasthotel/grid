
var container_markup = '<div data-id="${id}" class="container ${type} clearfix">'+
        	'<div class="tools">'+
                '<span class="c-title">${type}</span>'+
                '<span class="c-sort-handle"></span>'+
                '<span class="c-trash"></span>'+
				'<span class="c-edit"></span>'+
            '</div>'+
        	'<div class="c_before">'+
            	'<p>${prolog}</p>'+
            '</div>'+
        	'<div class="slots-wrapper">{{if slots}}{{tmpl(slots) "slotTemplate"}}{{/if}}</div>'+
            '<div class="c_after">'+
            	'<p>${epilog}</p>'+
            '</div>'+
        '</div>';
$.template( "containerTemplate", container_markup );

var container_editor_markup = '<div class="container-editor">'+
     '<form name="f-container">'+
     	'<label for="f-c-title">Title:</label><br />'+
     	'<input name="f-c-title" id="f-c-title" /><br />'+
        '<label for="f-c-style">Style</label><br />'+
        '<select name="f-c-style" id="f-c-style">'+
       		'<option value="">ohne style</option>'+
        	'<option value="style1">Style 1</option>'+
            '<option value="style2">Style 2</option>'+
            '<option value="style3">Style 3</option>'+
        '</select><br />'+
        '<label for="f-c-prolog">Prolog:</label><br />'+
        '<textarea name="f-c-prolog" id="f-c-prolog"></textarea><br />'+
        '<label for="f-c-epilog">Epilog:</label><br />'+
        '<textarea name="f-c-epilog" id="f-c-epilog"></textarea><br />'+
        '<label for="f-c-readmore-link">Link:</label><br />'+
        '<input name="f-c-readmore-link" id="f-c-readmore-link" />'+
        '<label for="f-c-readmore-text"></label><br />'+
        '<input name="f-c-readmore-text" id="f-c-readmore-text" />'+
     '</form>'+
     '</div>';
$.template( "containerEditorTemplate", container_editor_markup );

var slot_markup = '<div class="slot" data-id="${id}">{{if boxes}}{{tmpl(boxes) "boxTemplate"}}{{/if}}</div>';
$.template( "slotTemplate", slot_markup );

var box_markup = '<div class="box" data-id="${id}">${content}</div>';
$.template( "boxTemplate", box_markup );