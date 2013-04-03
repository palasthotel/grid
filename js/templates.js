
var container_markup = '<div data-id="${id}" class="container ${type} clearfix">'+
        	'<div class="tools">'+
                '<span class="c-title">${type}</span>'+
                '<span class="c-sort-handle"></span>'+
                '<span class="c-trash"></span>'+
            '</div>'+
        	'<div class="c_before">'+
            	'<p>${prolog}</p>'+
            '</div>'+
        	'<div class="slot-wrapper">{{each slots}}{{tmpl "slotTemplate"}}{{/each}}</div>'+
            '<div class="c_after">'+
            	'<p>${epilog}</p>'+
            '</div>'+
        '</div>';
$.template( "containerTemplate", container_markup );

var slot_markup = '<div class="slot" data-id="${id}">{{each boxes}}{{tmpl "boxTemplate"}}{{/each}}</div>';
$.template( "slotTemplate", slot_markup );

var box_markup = '<div class="box" data-id="${id}">${content}</div>';
$.template( "boxTemplate", box_markup );