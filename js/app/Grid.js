
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
		this.getContainerStyles().fetch();
		this.getSlotStyles().fetch();
		this.getBoxStyles().fetch();

		// load the grid + view
		jQuery("#new-grid-wrapper").html( this.getView().render().el );

		// load the revisions
		this.revisions = new Revisions({grid: this.getModel() });
        this.revisions.fetch();

		// init toolbar
		var toolbar  = new GridToolbarView({
			model: this.getModel()
		});

		jQuery("#new-grid-wrapper").prepend(toolbar.render().el);
		
		return this;
	},
	getModel: function(){
		if(!(this.grid instanceof Grid) ){
            this.grid = new Grid({
            	id:this.ID,
				SERVER: this.SERVER,
				PREVIEW_URL: this.PREVIEW_URL,
				DEBUGGING: this.DEBUGGING
            });
        }
		return this.grid;
	},
	getView: function(){
		if(!(this.gridview instanceof GridView) ){
            this.gridview = new GridView({model: this.getModel() });
        }
		return this.gridview;
	},
	// type collections
	getContainerTypes: function(){
        if(!(this.types_container instanceof ContainerTypes) ){
            this.types_container = new ContainerTypes();
        }
        return this.types_container;
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
	}
};

jQuery(function(){GRID.init();});
