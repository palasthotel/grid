
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
	dom_root: "#new-grid-wrapper",
	$root: null,
	dom_root_editor: "#new-grid-editor-wrapper",
	$root_editor: null,
	ID: null,
	// enable or disable debugging output
	DEBUGGING: false,
	// the server URL
	SERVER: "/grid_ajax_endpoint",
	// Pattern for preview URL
	PREVIEW_URL: window.location.pathname+'/preview',
	PREVIEW_PATTERN: window.location.pathname+'/{REV}/preview',
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
		if(typeof GRID.ID == "undefined" || GRID.ID == null) return false;

		GRID.$root.mutate('height',function (element,info){
		    console.log('a div with  has changed it\'s height, the function below should do something about this...');
		    //GRID.onSidebarCalculation();
		});

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
				GRID.$root.html( GRID.getView().render().el );
				GRID._initializeContainerSortable();
				GRID._initializeBoxSortable();
				// load the revisions
				GRID.revisions = new Revisions({grid: GRID.getModel() });
		        GRID.revisions.fetch();
		        // init toolbar
				GRID.toolbar  = new GridToolbarView({
					model: GRID.getModel()
				});
				GRID.$root.prepend(GRID.toolbar.render().el);
				jQuery(window).resize(function(){ GRID.toolbar.onResize() }).trigger("resize");
				GRID.onSidebarCalculation();
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
        GridRequest.grid.update(GRID.grid, {action: "setToRevision", revision: revision});
    },
	// initializes the constatns
	_initConstants: function(){
		// root elements
		this.$root = jQuery(this.dom_root);
		this.$root_editor = jQuery(this.dom_root_editor);
		// constants from CMS
		this.mode = document.gridmode;
		this.$root.addClass('gridmode-'+this.mode);

		this.DEBUGGING = document.grid_debug_mode;
		this.ID = document.ID;
		this.SERVER = "/grid_ajax_endpoint";
		if( typeof document.gridajax != "undefined" && 
			document.gridajax != null && 
			document.gridajax != ""){
			this.SERVER = document.gridajax;
		}
		this.PREVIEW_URL = this.PREVIEW_URL.replace("//","/");
		if( typeof document.previewurl != "undefined" && 
			document.previewurl != null && 
			document.previewurl != ""){
			this.PREVIEW_URL = document.previewurl;
		}
		var PREVIEW_PATTERN = window.location.pathname+'/{REV}/preview';
		if( typeof document.previewpattern != "undefined" && 
			document.previewpattern != null && 
			document.previewpattern != ""){
			PREVIEW_PATTERN = document.previewpattern;
		}
		this.PREVIEW_PATTERN=PREVIEW_PATTERN;
	},
	// calculates Sidebar
	onSidebarCalculation: function(){
		GRID.$root.find(".grid-containers-wrapper > .grid-container").css("margin-top", "0px");
		GRID.$root.find(".grid-containers-wrapper > .grid-container[data-type*=S] .grid-slot").css("padding-bottom", "0px");

		// add new offsets
		jQuery.each(GRID.$root.find('*:not(.grid-box) .grid-containers-wrapper > .grid-container[class*=S-]'), function(index, sidebar) {
			GRID.makeSidebarPuffer(jQuery(sidebar));
		});
	},
	makeSidebarPuffer: function($sidebar){
		var permissionsList = GRID.getSidebarWhitelist($sidebar.data("type"));
		var c_height = GRID.calculateSidebarableContainerHeight($sidebar.prev(), permissionsList);
		var $sidebar_slot = $sidebar.find('.grid-slot');
		//var sidebar_margin_bottom = parseInt($sidebar.css("margin-bottom"));
		if(c_height < $sidebar_slot.outerHeight(true)){
			// if sidebar is taller than containers make puffer margin top
			var needed_margin_top = $sidebar_slot.outerHeight();
			needed_margin_top -= c_height;
			$sidebar.css("margin-top", needed_margin_top);
		} else if(c_height > $sidebar_slot.outerHeight(true)){
			// if sidebar is smaller than containers expend sidebar slot
			var need_bottom_offset = c_height-$sidebar_slot.outerHeight();
			//need_bottom_offset += sidebar_margin_bottom;
			$sidebar_slot.css("padding-bottom",need_bottom_offset);
		}
	},	
	calculateSidebarableContainerHeight: function($container, floatablePermissionList){
		var c_height = 0;
		while($container.length > 0 && floatablePermissionList[$container.data('type')] ){
			c_height += $container.outerHeight(true);
			$container = $container.prev();
		}
		return c_height;
	},
	getSidebarWhitelist: function(sidebar_type){
		switch(sidebar_type){
			case "S-0-4":
				return {"C-8-0":true,"C-4-4-0":true, "C-4-2-2-0": true,
						"S-4-0":true, "C-0-4-0":true,
						"c-sort-placeholder": true, "container-drop-area-wrapper": true};
				break;
			case "S-4-0":
				return {"C-0-8":true,"C-0-4-4":true, 
						"S-0-4":true, "C-0-4-0":true, 
						"c-sort-placeholder": true, "container-drop-area-wrapper": true};
				break;
			case "S-0-6":
				return {"C-12-0":true, "C-4-4-4-0":true, "C-6-6-0":true, "C-3-3-3-3-0":true,
						"c-sort-placeholder": true, "container-drop-area-wrapper": true };
				break;
		}
		return {};
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
	revert: function(){	
        GridRequest.grid.update(GRID.grid, {action: "revertDraft"});
	},
	// console logging just with DEBUGGING enabled
	log: function(string){ if(this.DEBUGGING){ console.log(string); } },

	showEditor: function(callback) {
		jQuery(GRID.$root).animate(
			{
				width:0
			},
			220,
			function(){
				jQuery(GRID.$root).hide();
			}
		);
		setTimeout(function(){
			jQuery(GRID.$root_editor).show();
			jQuery(GRID.$root_editor).animate({width:"100%"},250,function(){
				callback();
			});
			window.scrollTo(0,0);
		},50);
	},

	hideEditor: function(callback) {
		jQuery(GRID.$root_editor).animate({width:"0%"},220, function(){jQuery(GRID.$root_editor).hide();});
		setTimeout(function(){
			jQuery(GRID.$root).show();
			jQuery(GRID.$root).animate({width:"100%"},220,function(){
				callback();
			})
			window.scrollTo(0,0);
		},50);
	},
	// initializes function to sort the containers
	_initializeContainerSortable: function(){
		var container_deleted;
		container_deleted=false;
		var container;
		var self=this;
		this.getView().$el.sortable({
            handle: ".grid-container-sorthandle, .grid-container-reused-layer",
            items:".container:not(.SC-4)",
            placeholder: "grid-container-sort-placeholder",
            pullPlaceholder: true,
            appendTo: this.getView().$el ,
            refreshPositions: true,
            helper: function(event, element){
                return jQuery("<div class='dragger-helper'></div>");
            },
            cursorAt: { left: 30, bottom: 30 },
            start: function( event, ui ){
                GRID.log(["container sort START"], event, ui);
                var old_container_id=ui.item.data("id");
                jQuery(".grid-element-trash").droppable({
	                accept: '.grid-container',
	                hoverClass: 'ui-state-hover',
	                drop:function(e,ui) {
	                	container=GRID.getModel().getContainers().get(old_container_id);
	                	container_deleted=true;
	                }
                });
            },
            stop: function(event, ui){
            	if(container_deleted)
            	{
            		container.destroy();
            	}
                //$(".box").slideDown(100);
            },
            update: function( event, ui ){
            	if(container_deleted)return;
            	var containerview = ui.item.attr("data-cid");
               
                var newIndex = ui.item.index();
                var containermodel = GRID.getModel().getContainers().get(containerview);
                var oldIndex = GRID.getModel().getContainers().indexOf(containermodel);

 				GRID.getModel().getContainers().move(containermodel, newIndex);
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
		new_container_id,
		box_deleted;
		box_deleted=false;
		this.getView().$el.find(".container[data-reused=false][data-type*=C-] .boxes-wrapper").sortable({
			items: ".grid-box",
			handle: ".grid-box-controls",
			//cancel: ".grid-box-edit, .grid-box-delete",
			connectWith: ".container[data-reused=false] .boxes-wrapper, .c-box-trash",
			placeholder: "grid-box-sort-placeholder",
			forcePlaceholderSize: true,
			distance: 10,
			refreshPositions: true,
			helper: function(event, element){
				return jQuery("<div class='dragger-helper'></div>");
			},
			cursorAt: { left: 30, top:30 },
			start: function(e, ui){
				jQuery(".c-box-trash").show();
				old_box_index = ui.item.index();
				old_slot_id = ui.item.parents(".slot").data("id");
				old_container_id = ui.item.parents(".container").data("id");

				GRID.log(["START BOX SORT", old_box_index, old_slot_id, old_container_id]);
				jQuery(".grid-element-trash").droppable({
					accept: '.slot .box',
					hoverClass: 'ui-state-hover',
					drop:function(e,ui) {
						var box = GRID.getModel().getContainers()
											     .get(old_container_id)
											     .getSlots().get(old_slot_id)
											     .getBox(old_box_index);
						box.destroy();
						box_deleted=true;
					}
				});
			},
			stop: function(e, ui){
				jQuery(".c-box-trash").hide();
				if(box_deleted)
					return;
				
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
			}
		});
	}
};

jQuery(function(){GRID.init();});


