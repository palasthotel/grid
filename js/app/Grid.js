
/**
*	IE JS console fix
*/
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/** public object */
window.GRID = {};
var GRID = window.GRID;

GRID = {
	ID: -1,
	// enable or disable debugging output
	DEBUGGING: false,
	// the server URL
	SERVER: "/grid_ajax_endpoint",
	// Pattern for preview URL
	PREVIEW_URL: window.location.pathname+'/preview',
	// initializes the grid
	grid: null,
	gridView: null,
	types_box: null,
    types_container: null,
    reusable_containers: null,
    styles_container: null,
    styles_slot: null,
    styles_box: null,
    revisions: null,
	init: function(){
		// initialize constants
		this._initConstants();

		// load all model classes for grid works
		this.getBoxTypes().fetch();
		this.getContainerTypes().fetch();
		this.getReusableContainers().fetch();
		this.getContainerStyles().fetch();
		this.getSlotStyles().fetch();
		this.getBoxStyles().fetch();

		// load the grid + view
		this.grid = new Grid({
        	id:this.ID,
			SERVER: this.SERVER,
			PREVIEW_URL: this.PREVIEW_URL,
			DEBUGGING: this.DEBUGGING,
			fn_success: function(data){
				GRID.gridview = new GridView({model: GRID.getModel() });
				jQuery("#new-grid-wrapper").html( GRID.getView().render().el );
				GRID._initializeContainerSortable();
				GRID._initializeBoxSortable();
				// load the revisions
				GRID.revisions = new Revisions({grid: GRID.getModel() });
		        GRID.revisions.fetch();
		        // init toolbar
				var toolbar  = new GridToolbarView({
					model: GRID.getModel()
				});
				jQuery("#new-grid-wrapper").prepend(toolbar.render().el);
			}
        });

		return this;
	},
	getModel: function(){
		return this.grid;
	},
	getView: function(){
		return this.gridview;
	},
	// type collections
	getContainerTypes: function(){
        if(!(this.types_container instanceof ContainerTypes) ){
            this.types_container = new ContainerTypes();
        }
        return this.types_container;
    },
    getReusableContainers: function(){
    	if(!(this.reusable_containers instanceof ReusableContainers)){
    		this.reusable_containers = new ReusableContainers();
    	}
    	return this.reusable_containers;
    },
    getBoxTypes: function(){
        if(!(this.types_box instanceof BoxTypes) ){
            this.types_box = new BoxTypes();
        }
        return this.types_box;
    },
    // style collections
    getContainerStyles: function(){
        if(!(this.styles_container instanceof Styles) ){
            this.styles_container = new Styles({type:"container"});
        }
        return this.styles_container;
    },
    getSlotStyles: function(){
        if(!(this.styles_slot instanceof Styles) ){
            this.styles_slot = new Styles({type:"slot"});
        }
        return this.styles_slot;
    },
    getBoxStyles: function(){
        if(!(this.styles_box instanceof Styles) ){
            this.styles_box = new Styles({type:"box"});
        }
        return this.styles_box;
    },
    // revisions
    setToRevision: function(revision){
        GridRequest.grid.update(grid, {action: "setToRevision", revision: revision});
    },
	// initializes the constatns
	_initConstants: function(){
		this.DEBUGGING = document.grid_debug_mode;
		GRID.ID = document.ID;
		GRID.SERVER = "/grid_ajax_endpoint";
		if( typeof document.gridajax != "undefined" && 
			document.gridajax != null && 
			document.gridajax != ""){
			GRID.SERVER = document.gridajax;
		}
		GRID.PREVIEW_URL = GRID.PREVIEW_URL.replace("//","/");
		if( typeof document.previewurl != "undefined" && 
			document.previewurl != null && 
			document.previewurl != ""){
			GRID.PREVIEW_URL = document.previewurl;
		}
	},
	// CKEDITOR functions
	useCKEDITOR: function(selector){
		CKEDITOR.replace(
			selector,{
				customConfig : document.PathToConfig
			}
		);
	},
	getCKEDITORVal: function(selector){
		return CKEDITOR.instances[selector].getData();
	},
	destroyCKEDITORs: function(){
		for(name in CKEDITOR.instances){
		    CKEDITOR.instances[name].destroy();
		}
	},
	// publishes the grid
	publish: function(){ new GridAjax("publishDraft",[GRID.ID]); },
	// revert to old revision
	revert: function(){	new GridAjax("revertDraft", [GRID.ID]); },
	// console logging just with DEBUGGING enabled
	log: function(string){ if(this.DEBUGGING){ console.log(string); } },

	showBoxEditor: function(callback) {
		jQuery("#new-grid-wrapper").animate(
			{
				width:0
			},
			220,
			function(){
				jQuery("#new-grid-wrapper").hide();
			}
		);
		setTimeout(function(){
			jQuery(".grid-boxeditor").show();
			jQuery(".grid-boxeditor").animate({width:"100%"},250,function(){
				callback();
			});
			window.scrollTo(0,0);
		},50);
	},

	hideBoxEditor: function(callback) {
		jQuery(".grid-boxeditor").animate({width:"0%"},220, function(){jQuery(".grid-boxeditor").hide();});
		setTimeout(function(){
			jQuery("#new-grid-wrapper").show();
			jQuery("#new-grid-wrapper").animate({width:"100%"},220,function(){
				callback();
			})
			window.scrollTo(0,0);
		},50);
	},
	// initializes function to sort the containers
	_initializeContainerSortable: function(){
		this.getView().$el.sortable({
            handle: ".c-sort-handle",
            items:".container:not(.SC-4)",
            placeholder: "c-sort-placeholder",
            pullPlaceholder: true,
            appendTo: this.getView().$el ,
            refreshPositions: true,
            helper: function(event, element){
                return jQuery("<div class='c-sort-helper'></div>");
            },
            cursorAt: { left: 30, bottom: 30 },
            start: function( event, ui ){
                GRID.log(["container sort START"], event, ui);
                // jQuery(this).sortable('refreshPositions');
                // GRID.getView().$el.find('.c-sort-placeholder').attr("data-type","c-sort-placeholder");
                // offset_top = parseInt(ui.item.css("margin-top"));
                // console.log(offset_top);
                // console.log(ui.helper);
                //$(ui.helper).css("top", 30+offset_top);
                //$(ui.helper).css("margin-left", event.clientX - $(event.target).offset().left);
            },
            stop: function(event, ui){
                //$(".box").slideDown(100);
            },
            update: function( event, ui ){
            	var containerview = ui.item.attr("data-cid");
               
                var newIndex = ui.item.index();
                var containermodel = GRID.getModel().getContainers().get(containerview);
                var oldIndex = GRID.getModel().getContainers().indexOf(containermodel);

 				GRID.getModel().getContainers().move(containermodel, newIndex);

                // params = [ID, ui.item.data("id"), ui.item.index()];
                // sendAjax("moveContainer",params,
                // function(data){
                //     if(data.result != true){
                //         throwError(lang_values["err_move_container"]);
                //         setTimeout(function(){
                //             window.location.reload();
                //         },1000);
                //     }
                //     $grid.trigger("structureChange");
                //     scrollToContainer(params[1]);
                // });
            }
        });
	},
	// initializes function to sort the containers
	_initializeBoxSortable: function(){
		var old_box_index,
		old_slot_id,
		old_container_id,
		new_box_index,
		new_slot_id,
		new_container_id;
		this.getView().$el.find(".container[data-reused=false][data-type*=C-] .boxes-wrapper").sortable({
			items: ".box",
			cancel: "span.edit",
			connectWith: ".container[data-reused=false] .boxes-wrapper, .c-box-trash",
			placeholder: "b-sort-placeholder",
			forcePlaceholderSize: true,
			distance: 10,
			refreshPositions: true,
			helper: function(event, element){
				return jQuery("<div class='dragger-helper'></div>");
			},
			cursorAt: { left: 30, top:30 },
			start: function(e, ui){
				
				old_box_index = ui.item.index();
				old_slot_id = ui.item.parents(".slot").data("id");
				old_container_id = ui.item.parents(".container").data("id");

				GRID.log(["START BOX SORT", old_box_index, old_slot_id, old_container_id]);
				// refreshBoxTrashs();
			},
			stop: function(e, ui){
				// hideBoxTrash();
				// if(boxDeleted){
				// 	boxDeleted = false;
				// 	console.log("trash!!!!");
				// 	return;
				// }
				
				new_container_id = ui.item.parents(".container").data("id");
				new_slot_id = ui.item.parents(".slot").data("id");
				new_box_index = ui.item.index();

				GRID.log(["STOP BOX SORT", old_box_index, old_slot_id, old_container_id, new_box_index, new_slot_id, new_container_id]);


				if(old_container_id == new_container_id &&
					old_slot_id == new_slot_id &&
					old_box_index == new_box_index){
					return;
				}

				var box = GRID.getModel()
								.getContainers().get(old_container_id)
								.getSlots().get(old_slot_id)
								.getBox(old_box_index);
				var new_slot = GRID.getModel()
								.getContainers().get(new_container_id)
								.getSlots().get(new_slot_id);

				GRID.getModel().moveBox(box, new_slot, new_box_index);


				// sendAjax(
				// 	"moveBox",
				// 	[
				// 		ID,
				// 		old_container_id,old_slot_id,old_box_index,
				// 		new_container_id,new_slot_id,new_box_index
				// 	],
				// 	function(data){
				// 		console.log("Box moved");
				// 		$grid.trigger("structureChange");
				// 		if(data.result != true){
				// 			// TODO: Rückmeldung geben und Box zurück sortieren!!!
				// 			console.log(data);
				// 			throwError(lang_values["err-move-box"]);
				// 		}
				// 		scrollToBox(ui.item.data("id"));
				// });
			}
		});
	}
};

jQuery(function(){GRID.init();});
