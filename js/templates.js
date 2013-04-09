
var container_markup = '<div data-id="${id}" data-type="${type}" class="container ${type} clearfix">'+
        	'<div class="tools">'+
                '<span class="c-title">${type}</span>'+
                '<span class="c-sort-handle"></span>'+
                '<span class="c-trash"></span>'+
				'<span class="c-edit"></span>'+
            '</div>'+
        	'<div class="c_before">'+
				'<p>${title}</p>'+
				'<p>${titleurl}</p>'+
            	'<p>${prolog}</p>'+
            '</div>'+
        	'<div class="slots-wrapper">{{if slots}}{{tmpl(slots) "slotTemplate"}}{{/if}}</div>'+
            '<div class="c_after">'+
            	'<p>${epilog}</p>'+
				'<p>${readmore}</p>'+
				'<p>${readmoreurl}</p>'+
				'<p>${style}</p>'+
            '</div>'+
        '</div>';
$.template( "containerTemplate", container_markup );

var container_editor_markup = '<div data-id="${id}" data-type="${type}" class="container editor ${type} clearfix">'+
        	'<div class="tools">'+
                '<span class="c-title">${type}</span>'+
                '<span class="c-ok"></span>'+
                '<span class="c-sort-handle"></span>'+
                '<span class="c-trash"></span>'+
            '</div>'+
        	'<div class="c_before">'+
            	'<label for="f-c-title">Title:</label><br />'+
                '<input name="f-c-title" id="f-c-title" value="${title}" /><br />'+
                '<label for="f-c-titleurl">Titel URL:</label><br />'+
                '<input name="f-c-titleurl" id="f-c-titleurl" value="${titleurl}" /><br />'+
                '<label for="f-c-prolog">Prolog:</label><br />'+
                '<textarea name="f-c-prolog" id="f-c-prolog">${prolog}</textarea>'+
            '</div>'+
        	'<div class="slots-wrapper">'+
				// slots hier anheften
            '</div>'+
            '<div class="c_after">'+
                '<label for="f-c-epilog">Epilog:</label><br />'+
        		'<textarea name="f-c-epilog" id="f-c-epilog">${epilog}</textarea> ' +              
            '</div>'+
            '<div class="clearfix">'+
            	'<fieldset>'+
                    '<label for="f-c-readmore-text">Readmore Text:</label><br />'+
                    '<input name="f-c-readmore-text" id="f-c-readmore-text" value="${readmore}" />'+
                '</fieldset>'+
                '<fieldset>'+
                    '<label for="f-c-readmore-link">Readmore URL:</label><br />'+
                    '<input name="f-c-readmore-link" id="f-c-readmore-link" value="${readmoreurl}" />'+
                '</fieldset>'+
                '<fieldset>'+
                    '<label for="f-c-style">Style</label><br />'+ 
                    '<select name="f-c-style" id="f-c-style">'+
                        '<option value="">ohne style</option>'+
                        '<option value="style1">Style 1</option>'+
                        '<option value="style2">Style 2</option>'+
                        '<option value="style3">Style 3</option>'+
                   '</select>'
                '</fieldset>'+
            '</div>'+
        '</div>';
$.template( "containerEditorTemplate", container_editor_markup );

var slot_markup = '<div class="slot" data-id="${id}">{{if boxes}}{{tmpl(boxes) "boxTemplate"}}{{/if}}</div>';
$.template( "slotTemplate", slot_markup );

var box_markup = '<div class="box" data-id="${id}">${content}</div>';
$.template( "boxTemplate", box_markup );