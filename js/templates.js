
var container_markup = '<div data-id="${id}" data-type="${type}" data-style="${style}" class="container ${type} clearfix">'+
        	'<div class="c-tools">'+
				
                '<span role="sort-handle" class="c-sort-handle c-tool"></span>'+
                '<span role="trash" class="c-trash c-tool"></span>'+
				'<span role="edit" class="c-edit c-tool"></span>'+
            '</div>'+
			'<p class="c-title">${title}</p>'+
        	'<div class="c-before">'+
				'<p class="c-titleurl">${titleurl}</p>'+
            	'<p class="c-prolog">${prolog}</p>'+
            '</div>'+
        	'<div class="slots-wrapper clearfix">{{if slots}}{{tmpl(slots) "slotTemplate"}}{{/if}}</div>'+
            '<div class="c-after">'+
            	'<p class="c-epilog">${epilog}</p>'+
				'<p class="c-readmore">${readmore}</p>'+
				'<p class="c-readmoreurl">${readmoreurl}</p>'+
				'<p class="c-style">${style}</p>'+
            '</div>'+
        '</div>';
$.template( "containerTemplate", container_markup );

var container_editor_markup = '<div data-id="${id}" data-type="${type}" class="container editor ${type} clearfix">'+
			'<div class="c-tools">'+
                '<span role="ok" class="c-ok c-tool"></span>'+
				'<span role="revert" class="c-revert c-tool"></span>'+
                '<span role="sort-handle" class="c-sort-handle c-tool"></span>'+
                '<span role="trash" class="c-trash c-tool"></span>'+
            '</div>'+
        	'<div class="c-before">'+
            	'<label for="f-c-title">Title:</label><br />'+
                '<input name="f-c-title" id="f-c-title" value="${title}" /><br />'+
                '<label for="f-c-titleurl">Titel URL:</label><br />'+
                '<input name="f-c-titleurl" id="f-c-titleurl" value="${titleurl}" /><br />'+
                '<label for="f-c-prolog">Prolog:</label><br />'+
                '<textarea name="f-c-prolog" id="f-c-prolog">${prolog}</textarea>'+
            '</div>'+
        	'<div class="slots-wrapper clearfix">'+
				// slots hier anheften
            '</div>'+
            '<div class="c-after">'+
                '<label for="f-c-epilog">Epilog:</label><br />'+
        		'<textarea name="f-c-epilog" id="f-c-epilog">${epilog}</textarea> ' +              
            '</div>'+
            '<div class="clearfix">'+
            	'<fieldset>'+
                    '<label for="f-c-readmore">Readmore Text:</label><br />'+
                    '<input name="f-c-readmore" id="f-c-readmore" value="${readmore}" />'+
                '</fieldset>'+
                '<fieldset>'+
                    '<label for="f-c-readmoreurl">Readmore URL:</label><br />'+
                    '<input name="f-c-readmoreurl" id="f-c-readmoreurl" value="${readmoreurl}" />'+
                '</fieldset>'+
                '<fieldset>'+
                    '<label for="f-c-style">Style</label><br />'+ 
                    '<select name="f-c-style" id="f-c-style">'+
                        '<option value="">ohne style</option>'+
						'{{if styles}}{{each styles}}'+
							'<option {{if $value == style }}selected="selected"{{/if}} value="${$value}">${$value}</option>'+
						'{{/each}}{{/if}}'
                   '</select>'
                '</fieldset>'+
            '</div>'+
        '</div>';
$.template( "containerEditorTemplate", container_editor_markup );

var slot_markup = '<div class="slot" data-id="${id}" data-style="${style}">'+
						'<div class="style-changer">'+
							'<span>{{if style}}${style}{{else}}ohne Style{{/if}}</span>'+
							'<ul class="choose-style"></ul>'+
						'</div>'+
						'{{if boxes}}{{tmpl(boxes) "boxTemplate"}}{{/if}}'+
				'</div>';
$.template( "slotTemplate", slot_markup );

var box_markup = '<div class="box" data-id="${id}">'+
						'<h3><a href="${titleurl}" class="box-title">${title}</a></h3>'+
                        '<div class="prolog">{{html prolog}}</div>'+
                        '<div class="content">${content}</div>'+
                        '<div class="epilog">{{html epilog}}</div>'+
                        '<p class="readmore"><a href="${readmoreurl}">${readmore}</a></p>'+
				'</div>';
$.template( "boxTemplate", box_markup );

var box_draggable_markup = '<li class="box-dragger" data-id="${id}"'+
							' data-titleurl="${titleurl}" data-readmore="${readmore}" data-readmoreurl="${readmoreurl}">'+
							'<div class="prolog">{{html prolog}}</div>'+
							'<div class="handle"></div><div class="title">${title}</div>'+
							'<div class="content">${content}</div>'+
							'<div class="epilog">{{html epilog}}</div>'+
							'</li>';
$.template( "boxDraggableTemplate", box_draggable_markup );