/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

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
	dom_root_authors: "#grid-authors-wrapper",
	$root_authors: null,
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
    async: null,
    authors: null,
	init: function(){

		// initialize constants
		this._initConstants();
		if(typeof GRID.ID === "undefined" || GRID.ID === null) return false;
		/**
		 * loading indicator before grid is ready
		 *
		 */
		GRID.$loading = ich.tpl_loading();
		this.$root.append(GRID.$loading);
		GRID.$loading.addClass("grid-init-loading");

		// load all model classes for grid works
		this.getBoxTypes().fetch();
		this.getContainerTypes().fetch();
		this.getReusableContainers().fetch();
		this.getContainerStyles().fetch();
		this.getSlotStyles().fetch();
		this.getBoxStyles().fetch();

		/**
		 * init async websocket magic
		 * @type {GridAsync}
		 */
		this.async = new GridAsync();
		this.authors = new GridAuthors();
		this.async.addObserver(this);
		this.async.addObserver(this.authors);

		this.getRights().fetch({
			success:function(){

				// load the grid + view
				GRID.grid = new Grid({
					id:GRID.ID,
					SERVER: GRID.SERVER,
					PREVIEW_URL: GRID.PREVIEW_URL,
					DEBUGGING: GRID.DEBUGGING,
					fn_success: GRID.new_grid_success
				});

			}
		});

		return this;
	},
	reload: function(){
		this.grid.destroy();
		this.grid = null;
		this.$root_authors.empty();
		if(this.gridView != null){
			this.gridView.remove();
		}
		this.newGrid();
	},
	newGrid: function(){
		// load the grid + view
		this.grid = new Grid({
        	id:this.ID,
			SERVER: this.SERVER,
			PREVIEW_URL: this.PREVIEW_URL,
			DEBUGGING: this.DEBUGGING,
			fn_success: GRID.new_grid_success
        });
		return this;
	},

	new_grid_success: function(data){
		GRID.$root.empty();
		GRID.$root.append(GRID.$loading);
		GRID.IS_SIDEBAR = GRID.getModel().get("isSidebar");

		GRID.gridview = new GridView({model: GRID.getModel() });
		// handle rights
		GRID.gridview.listenTo(GRID.getRights(),"change",GRID.onRights);

		GRID.$root.append( GRID.getView().render().el );

		jQuery(GRID.dom_root).mutate('height',function (element,info){
			GRID.onSidebarCalculation();
		});

		GRID.$root
			.data("isSidebar",GRID.IS_SIDEBAR)
			.addClass('grid-is-sidebar-'+GRID.IS_SIDEBAR);

		if(!GRID.IS_SIDEBAR) GRID._initializeContainerSortable();
		GRID._initializeBoxSortable();
		// load the revisions
		GRID.revisions = new Revisions({grid: GRID.getModel() });
		GRID.revisions.fetch();
		// init toolbar
		GRID.toolbar  = new GridToolbarView({
			model: GRID.getModel()
		});
		GRID.async.addObserver(GRID.toolbar);
		GRID.$root.prepend(GRID.toolbar.render().el);

		GRID.onSidebarCalculation();
		GRID.$loading.removeClass("grid-init-loading");

		/**
		 * init async connection on grid loading done
		 */
		GRID.async.init();

		/**
		 * listen to changes of window size
		 */
		jQuery(window).resize(function(){ GRID.toolbar.onResize() }).trigger("resize");
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
    getRights: function(){
    	if(!(this.rights instanceof GridRights)){
    		this.rights = new GridRights();
    	}
    	return this.rights;
    },
    // revisions
    setToRevision: function(revision){
    	if(GRID.locked()) return;
        GridRequest.grid.update(GRID.grid, {action: "setToRevision", revision: revision});
    },
    // onRightsChange
    onRights: function(rights){
    	GRID.log(["onrights",rights]);
    	GRID.getView().render();
    	GRID.toolbar.render();
    },
	// initializes the constatns
	_initConstants: function(){
		// root elements
		this.$root = jQuery(this.dom_root);
		this.$root_editor = jQuery(this.dom_root_editor);
		this.$root_authors = jQuery(this.dom_root_authors);
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
		if( typeof document.previewurl != typeof undefined &&
			document.previewurl != null &&
			document.previewurl != ""){
			this.PREVIEW_URL = document.previewurl;
		}
		var PREVIEW_PATTERN = window.location.pathname+'/{REV}/preview';
		if( typeof document.previewpattern != typeof undefined &&
			document.previewpattern != null &&
			document.previewpattern != ""){
			PREVIEW_PATTERN = document.previewpattern;
		}
		this.PREVIEW_PATTERN=PREVIEW_PATTERN;
	},
	// calculates Sidebar
	onSidebarCalculation: function($root){
		if(typeof $root == "undefined") $root = GRID.$root;
		$root.find(".grid-containers-wrapper > .grid-container-type-s")
					.css("padding-top", "0px");
		$root.find(".grid-containers-wrapper > .grid-container-type-s .grid-slot")
					.css("padding-bottom", "0px")
					.css("bottom", "0px");

		jQuery.each($root.find('*:not(.grid-box) .grid-containers-wrapper > .grid-container-type-s'), function(index, sidebar) {
			GRID.makeSidebarPuffer(jQuery(sidebar));
		});
	},
	makeSidebarPuffer: function($sidebar){
		var $sidebar_slot = $sidebar.find('.grid-slot').first();
		var c_height = GRID.calculateSidebarableContainerHeight($sidebar);
		$sidebar_slot.css("bottom", $sidebar.outerHeight()+"px");
		if(c_height < $sidebar_slot.outerHeight(true)){
			// if sidebar is taller than containers make puffer margin top
			var needed_margin_top = $sidebar_slot.outerHeight();
			needed_margin_top -= c_height;
			$sidebar.css("padding-top", needed_margin_top);
		} else if(c_height > $sidebar_slot.outerHeight(true)){
			// if sidebar is smaller than containers expend sidebar slot
			var need_bottom_offset = c_height-$sidebar_slot.outerHeight();
			$sidebar_slot.css("padding-bottom",need_bottom_offset+"px");
		}

	},
	calculateSidebarableContainerHeight: function($sidebar){
		var c_height = 0;
		var container_side = null;
		var sidebar_space = 0;
		if($sidebar.data("space-left") > 0){
			container_side = "right";
			sidebar_space = $sidebar.data("space-left");
		} else if($sidebar.data("space-right")>0){
			container_side = "left";
			sidebar_space = $sidebar.data("space-right");
		} else {
			GRID.log(["sidebar with no space?", $sidebar]);
			return c_height;
		}
		var $container = $sidebar.prev();
		while( $container.length > 0 &&
				(
					Math.abs( 1-($container.data("space-"+container_side)+sidebar_space)) < 0.005
					||  $container.hasClass('grid-container-sort-placeholder')
				)
			){
			c_height += $container.outerHeight(true);
			$container = $container.prev();
		}
		return c_height;
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
		for(var name in CKEDITOR.instances){
		    CKEDITOR.instances[name].destroy();
		}
	},
	// publishes the grid
	publish: function(){
		if( !GRID.getRights().get("publish") || GRID.locked() ){
			alert("Sorry you have no rights for that...");
			return false;
		}
		new GridAjax("publishDraft",[GRID.ID]);
	},
	// revert to old revision
	revert: function(){
		if(GRID.locked()) return;
        GridRequest.grid.update(GRID.grid, {action: "revertDraft"});
	},
	// console logging just with DEBUGGING enabled
	log: function(string){ if(this.DEBUGGING){ console.log(string); } },
	/**
	 * change to box and container editor
	 */
	showEditor: function(callback) {
		GRID.$root.animate(
			{
				width:0
			},
			220,
			function(){
				GRID.$root.hide();
			}
		);
		setTimeout(function(){
			GRID.$root_editor.show();
			GRID.$root_editor.animate({width:"100%"},250,function(){
				callback();
			});
			window.scrollTo(0,0);
		},50);
	},
	hideEditor: function(callback) {
		GRID.$root_editor.animate({width:"0%"},220, function(){GRID.$root_editor.hide();});
		setTimeout(function(){
			GRID.$root.show();
			GRID.$root.animate({width:"100%"},220,function(){
				callback();
				GRID.onSidebarCalculation();
			});
			window.scrollTo(0,0);
		},50);
	},
	/**
	 * change to authors
	 */
	toggleAuthors: function(){
		if(GRID.$root_authors.html()==""){
			GRID.$root_authors.empty();
			var authors = new Authors();
			GRID.$root_authors.append(authors.render().$el);
			authors.listenTo( GRID.toolbar,'toolbar_resize', authors.onResize);
		}

		GRID.$root.toggleClass("is-active-authors");
		GRID.$root_authors.toggleClass("is-active");
		GRID.toolbar.onResize();
	},
	showAuthors: function(){
		this.hideAuthors();
		this.toggleAuthors();
	},
	hideAuthors: function(){
		GRID.$root.removeClass("is-active-authors");
		GRID.$root_authors.removeClass("is-active");
	},
	locked: function(){
		return !GRID.authors.haveLock();
	},
	async_locking_is_locked: function(){
		if(GRID.locked()){
			GRID.$root.addClass("grid-is-locked");
			GRID.showAuthors();
		} else if(GRID.$root.hasClass("grid-is-locked")){
			GRID.reload();
			GRID.$root.removeClass("grid-is-locked");
			this.hideAuthors();
		}
	},
	async_disconnect: function(){
		this.async_locking_is_locked();
	},
	// initializes function to sort the containers
	_initializeContainerSortable: function(){
		if(!GRID.getRights().get("move-container") || GRID.locked()) return false;
		var container_deleted;
		container_deleted=false;
		var container;
		var self=this;
		this.getView().$el.sortable({
            handle: ".grid-container-sorthandle, .grid-container-reused-layer",
            items:".grid-container:not(.grid-container-type-sc)",
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
                jQuery(".grid-element-trash").addClass("grid-active").droppable({
	                accept: '.grid-container',
	                hoverClass: 'grid-hover',
	                drop:function(e,ui) {
	                	container=GRID.getModel().getContainers().get(old_container_id);
	                	container_deleted=true;
	                }
                });
            },
            stop: function(event, ui){
            	jQuery(".grid-element-trash").removeClass('grid-active');
            	if(container_deleted)
            	{
            		container.destroy();
            	}
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
		if(!GRID.getRights().get("move-box") || GRID.locked() ) return false;
		var old_box_index,
		old_slot_id,
		old_container_id,
		new_box_index,
		new_slot_id,
		new_container_id,
		box_deleted;
		box_deleted=false;
		this.getView().$el.find(".grid-container-type-c[data-reused=false] .grid-boxes-wrapper, .grid-container-type-sc .grid-boxes-wrapper").sortable({
			items: ".grid-box",
			handle: ".grid-box-controls",
			//cancel: ".grid-box-edit, .grid-box-delete",
			connectWith: ".grid-container-type-c[data-reused=false] .grid-boxes-wrapper, .grid-element-trash",
			placeholder: "grid-box-sort-placeholder",
			forcePlaceholderSize: true,
			distance: 10,
			refreshPositions: true,
			helper: function(event, element){
				return jQuery("<div class='dragger-helper'></div>");
			},
			cursorAt: { left: 30, top:30 },
			start: function(e, ui){
				// jQuery(".grid-box-trash").show();
				old_box_index = ui.item.index();
				old_slot_id = ui.item.parents(".grid-slot").data("id");
				old_container_id = ui.item.parents(".grid-container").data("id");

				GRID.log(["START BOX SORT", old_box_index, old_slot_id, old_container_id]);
				jQuery(".grid-element-trash").addClass("grid-active").droppable({
					accept: '.grid-slot .grid-box',
					hoverClass: 'grid-hover',
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
				//jQuery(".grid-box-trash").hide();
				jQuery(".grid-element-trash").removeClass("grid-active");
				if(box_deleted)	return;

				new_container_id = ui.item.parents(".grid-container").data("id");
				new_slot_id = ui.item.parents(".grid-slot").data("id");
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
	},
	flash: function(){
		GRID.gridview.$el.fadeIn(100).fadeOut(100).fadeIn(100);
	},
	startLoading: function(){
		clearTimeout(GRID.loading_hide_timeout);
		GRID.$loading.show();
		GRID.$loading.addClass("loading");

	},
	finishLoading: function(){
		GRID.$loading.removeClass("loading");
		clearTimeout(GRID.loading_hide_timeout);
		GRID.loading_hide_timeout = setTimeout(function(){
			GRID.$loading.hide();
		},1200);
	}

};

jQuery(function(){GRID.init();});


