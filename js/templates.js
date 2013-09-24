
var container_markup = '<div data-id="${id}" data-type="${type}" data-style="${style}"'+
							' data-reused="{{if reused}}true{{else}}false{{/if}}" class="container display ${type} clearfix">'+
        	'<div class="c-tools">'+
                '<span role="sort-handle" class="c-sort-handle c-tool hide-c-editor"></span>'+
                '<span role="trash" class="c-trash c-tool hide-c-editor"></span>'+
				'<span role="edit" class="c-edit c-tool"></span>'+
				
				'{{if reused}}<span role="reuse" class="c-reuse" title="${reusetitle}"></span>{{else}}'+
				'<span role="reuse" class="c-reuse c-tool hide-c-editor"></span>{{/if}}'+
				
				'<span role="box-trash" class="c-box-trash"></span>'+
            '</div>'+
            '{{if !is_sidebar}}'+
			'<p class="c-title">${title}</p>'+
        	'<div class="c-before">'+
				'<p class="c-titleurl">${titleurl}</p>'+
            	'<div class="c-prolog">{{html prolog}}</div>'+
            '</div>'+
            '{{/if}}'+
        	'<div class="slots-wrapper clearfix">{{if slots}}{{tmpl(slots) "slotTemplate"}}{{/if}}</div>'+
        	'{{if !is_sidebar}}'+
            '<div class="c-after">'+
            	'<div class="c-epilog">{{html epilog}}</div>'+
				'<p><span class="c-readmore">${readmore}</span>'+
					'{{if readmoreurl}} [ <span class="c-readmoreurl">${readmoreurl}</span> ]'+
					' {{else}} <span class="c-readmoreurl">${readmoreurl}</span>{{/if}}</p>'+
				'<p class="c-style">${styleTitle}</p>'+
            '</div>'+
            '{{/if}}'+
        '</div>';
jQuery.template( "containerTemplate", container_markup );

var container_editor_markup = '<div data-id="${id}" data-type="${type}" class="container editor ${type} clearfix">'+
			'<div class="c-tools">'+
                '<span role="ok" class="c-ok c-tool"></span>'+
				'<span role="revert" class="c-revert c-tool"></span>'+
                '<span role="sort-handle" class="c-sort-handle c-tool hide-c-editor"></span>'+
                '<span role="trash" class="c-trash c-tool hide-c-editor"></span>'+
				'<span role="box-trash" class="c-box-trash"></span>'+
            '</div>'+
        	'<div class="c-before">'+
            	'<label for="f-c-title">'+document.lang_values["label-title"]+'</label>'+
                '<input type="text" name="f-c-title" id="f-c-title" value="${title}" class="form-text" />'+
                '<label for="f-c-titleurl">'+document.lang_values["label-title-url"]+'</label>'+
                '<input type="text" name="f-c-titleurl" id="f-c-titleurl" value="${titleurl}" class="form-text" />'+
                '<label for="f-c-prolog">'+document.lang_values["label-prolog"]+'</label>'+
                '<textarea name="f-c-prolog" id="f-c-prolog" class="form-html">${prolog}</textarea>'+
            '</div>'+
        	'<div class="slots-wrapper clearfix">'+
				// slots hier anheften
            '</div>'+
            '<div class="c-after">'+
                '<label for="f-c-epilog">'+document.lang_values["label-epilog"]+'</label>'+
        		'<textarea name="f-c-epilog" id="f-c-epilog" class="form-html">${epilog}</textarea> ' +              
				'<div class="clearfix">'+
					'<fieldset>'+
						'<label for="f-c-readmore">'+document.lang_values["label-readmore"]+'</label>'+
						'<input type="text" name="f-c-readmore" id="f-c-readmore" value="${readmore}" class="form-text" />'+
					'</fieldset>'+
					'<fieldset>'+
						'<label for="f-c-readmoreurl">'+document.lang_values["label-readmore-url"]+'</label>'+
						'<input type="text" name="f-c-readmoreurl" id="f-c-readmoreurl" value="${readmoreurl}" class="form-text" />'+
					'</fieldset>'+
					'<fieldset class="fieldset-c-style">'+
						'<label for="f-c-style">'+document.lang_values["label-style"]+'</label>'+ 
						'<select name="f-c-style" id="f-c-style" class="form-select">'+
							'<option value="">'+document.lang_values["default-style"]+'</option>'+
							'{{if styles}}{{each styles}}'+
								'<option {{if $value.slug == style }}selected="selected"{{/if}} value="${$value.slug}">${$value.title}</option>'+
							'{{/each}}{{/if}}'
					   '</select>'
					'</fieldset>'+
				'</div>'+
			'</div>'+
        '</div>';
jQuery.template( "containerEditorTemplate", container_editor_markup );

var slot_markup = '<div class="slot" data-id="${id}" data-style="${style}">'+
						'<div class="style-changer">'+
							'<span>{{if style}}${style}{{else}}'+document.lang_values["default-style"]+'{{/if}}</span>'+
						'</div>'+
						'<div class="boxes-wrapper">{{if boxes}}{{tmpl(boxes) "boxTemplate"}}{{/if}}</div>'+
				'</div>';
jQuery.template( "slotTemplate", slot_markup );

var box_markup = '<div class="box" data-id="${id}" data-type="${type}">'+
						'<h3>{{if titleurl!=""}}<a href="${titleurl}" class="box-title">${title}</a>{{else}}${title}{{/if}}</h3>'+
						"{{if type !='reference'}}<span class='edit'></span>{{/if}}"+
                        '<div class="prolog">{{html prolog}}</div>'+
                        '<div class="content">{{html html}}</div>'+
                        '<div class="epilog">{{html epilog}}</div>'+
                        '<p class="readmore"><a href="${readmoreurl}">${readmore}</a></p>'+
				'</div>';
jQuery.template( "boxTemplate", box_markup );

var box_draggable_markup = '<li class="box-dragger" data-id="${id}" data-type="${type}" data-index="${index}"'+
							' data-titleurl="${titleurl}" data-readmore="${readmore}" data-readmoreurl="${readmoreurl}">'+
							'<div class="prolog">{{html prolog}}</div>'+
							'<div class="handle"></div><div class="title">${title}</div>'+
							'<div class="content">{{html html}}</div>'+
							'<div class="epilog">{{html epilog}}</div>'+
							'</li>';
jQuery.template( "boxDraggableTemplate", box_draggable_markup );

var box_editor_markup = '<div class="box-editor" data-b-index="${b_index}" data-id="${box.id}" '+
							'data-c-id="${c_id}" data-s-id="${s_id}" data-type="${box.type}">'+

							'<fieldset class="collapsable collapsable-hidden text-fields">'+
								'<legend>'+document.lang_values["label-b-before"]+'</legend>'+
								'<div class="field-wrapper">'+

									'<label>'+document.lang_values["label-title"]+'</label>'+
									'<input name="f-b-title" type="text" value="${box.title}" class="form-text" /> '+
									'<label>'+document.lang_values["label-title-url"]+'</label>'+
									'<input name="f-b-titleurl" type="text" value="${box.titleurl}" class="form-text" />'+
									'<label>'+document.lang_values["label-prolog"]+'</label>'+
									'<textarea name="f-b-prolog" class="form-html">${box.prolog}</textarea>'+
									
								'</div>'+
							'</fieldset>'+

							'<fieldset class="collapsable dynamic-fields">'+
								'<legend>'+document.lang_values["label-b-dynamic"]+'</legend>'+
								'<div class="field-wrapper"></div>'+
								// inputs for types added by script
							'</fieldset>'+

							'<fieldset class="collapsable collapsable-hidden text-fields">'+
								'<legend>'+document.lang_values["label-b-after"]+'</legend>'+
								'<div class="field-wrapper">'+

									'<label>'+document.lang_values["label-epilog"]+'</label>'+
									'<textarea name="f-b-epilog"  class="form-html">${box.epilog}</textarea>'+

									'<label>'+document.lang_values["label-readmore"]+'</label>'+
									'<input name="f-b-readmore" type="text" value="${box.readmore}" class="form-text" /> '+
									'<label>'+document.lang_values["label-readmore-url"]+'</label>'+
									'<input name="f-b-readmoreurl" type="text" value="${box.readmoreurl}" class="form-text" />'+
									
								'</div>'+
							'</fieldset>'+
							'<div class="box-styles-wrapper">'+
							'<label for="f-b-style">Style</label>'+ 
							'<select name="f-b-style" class="form-select"  id="f-b-style">'+
								'<option value="">'+document.lang_values["default-style"]+'</option>'+
								'{{if styles}}{{each styles}}'+
									'<option {{if $value.slug == box.style }}selected="selected"{{/if}} value="${$value.slug}">'+
									'${$value.title}</option>'+
								'{{/each}}{{/if}}'+
							'</select>'+
							'</div>'+
						'</div>';
jQuery.template("boxEditorTemplate", box_editor_markup);

var in_box_autocomplete_markup = "<div class='"+
									"{{if val != '' || val === 0}}locked {{/if}}"+
									"autocomplete-wrapper form-autocomplete dynamic-value' >"+
									"<input type='text' class='form-text autocomplete i-autocomplete' "+
									"{{if val !='' || val === 0}}disabled=disabled {{/if}}"+
									"data-key='${key}' data-type='${type}' data-value-key='${val}' value='${val}' data-path='${path}' />"+
									"<div class='loading rotate'></div>"+
									"<div class='cancle'></div>"+
									"<ul class='suggestion-list'></ul>"+
									'{{if linktext}}'+
									'<p class="links">'+
										'<a class="full" data-raw="${urlraw}" href="${url}" target="_blank">${linktext}</a>'+
										'<a class="empty" data-raw="${emptyurlraw}" href="${emptyurl}" target="_blank">${emptylinktext}</a>'+
									'</p>'+
									'{{/if}}'+
								"</div>";
jQuery.template("inBoxAutocompleteTemplate", in_box_autocomplete_markup);

var reuse_container_markup = '<li class="container-dragger new-container ${type}" '+
							'data-type="${type}" data-reusable="reusable" data-id="${id}">'+
								'<div class="r-title">${reusetitle}</div>'+
								'<div class="clearfix">'+
								'{{if slots}}{{each slots}}'+
									'<div class="slot"></div>'+
								'{{/each}}{{/if}}'+
								'</div>'+
							'</li>';
jQuery.template("containerReusableTemplate", reuse_container_markup);

var revision_markup = '<li  role="revision" data-number="${number}">'+
							'<div class="rev-number">${number}</div>'+
							'<div class="rev-info">'+
								'<span class="rev-date">${date}</span><br/>'+
								'von <span class="rev-editor">${editor}</span>'+
							'</div>'+
							'<div class="rev-controls">'+
							'{{if state == "draft"}}'+
								'<button>Preview</button>'+
								'<button>Revert</button>'+
							'{{/if}}{{if state == "draft" }}'+
								'<button>Delete</button>'+
							'{{/if}}'+
							'</div>'
						'</li>';
jQuery.template("revisionTemplate", revision_markup);

var revision_table_markup = '<tr role="revision" data-number="${number}">'+
								'<td class="rev-number">${number}</td>'+
								'<td class="rev-info">'+
									'<span class="rev-date">${date}</span><br/>'+
									'von <span class="rev-editor">${editor}</span>'+
								'</td>'+
								'<td class="rev-controls">'+
								'{{if state == "draft"}}'+
									'<button role="revision-delete">Delete</button>'+
								'{{/if}}{{if state == "depreciated"}}'+
									'<button role="revision-preview">Preview</button>'+
									'<button role="revision-use">Revert</button>'+
								'{{/if}}'+
								'</td>'
							'</tr>';
jQuery.template("revisionTableTemplate", revision_table_markup);


