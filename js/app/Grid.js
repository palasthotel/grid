
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
window.GRID = {},
window.GRID.AJAX = {};
var GRID = window.GRID;

GRID = {
	ID: -1,
	// enable or disable debugging output
	DEBUGGING: false,
	// the server URL
	SERVER: "/grid_ajax_endpoint",
	// Pattern for preview URL
	PREVIEW_URL: window.location.pathname+'/preview',
	// 0 draft, 1 published
	_state: 0,
	// list of all contaiers in the right order
	grid: null,
	// wrapper of the icanhaz template strings
	templates: {},
	// initializes the grid
	init: function(){
		var self = this;
		this._initConstants();
		this.grid = new Grid({
			id:this.ID
		});
		return new GridView({model: this.grid});
		//return this.grid;
	},
	_initTemplates: function(){
		new GridAjax(
			
		);
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
	// publishes the grid
	publish: function(){ new GridAjax("publishDraft",[GRID.ID]); },
	// revert to old revision
	revert: function(){	new GridAjax("revertDraft", [GRID.ID]); },
	// console logging just with DEBUGGING enabled
	log: function(string){ if(this.DEBUGGING){ console.log(string); } }
};