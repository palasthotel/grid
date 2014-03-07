
var Grid = Backbone.Model.extend({
	defaults :{
		ID: -1,
		// enable or disable debugging output
		DEBUGGING: false,
		// the server URL
		SERVER: "/grid_ajax_endpoint",
		// Pattern for preview URL
		PREVIEW_URL: window.location.pathname+'/preview',
		// 0 draft, 1 published
		state: 0,
		containers: []
	},
	// invokes when the model is created
    initialize: function (spec) {
        if (!spec || !spec.ID ) {
            throw "InvalidConstructArgs";
        }

        var self = this;
       	new GridAjax(
			"loadGrid",
			[this.get("ID")],
			{ 
				success_fn: function(data){
					_.each(data.result.container, function(container) {
						console.log(container);
						 var c = new Container(container);
						 self.addContainer(c);
					});
					new GridAjax(
						"getMetaTypesAndSearchCriteria",
						[],
						{ success_fn: function(data){ self.set("types_box", data.result); } }
					);
					new GridAjax(
						"getContainerTypes",
						[],
						{ success_fn: function(data){ self.set("types_container", data.result); } }
					);
					new GridAjax(
						"getContainerStyles",
						[],
						{ success_fn: function(data){ self.set("styles_container", data.result); } }
					);
					new GridAjax(
						"getSlotStyles",
						[],
						{ success_fn: function(data){ self.set("styles_slot", data.result); } }
					);
					new GridAjax(
						"getBoxStyles",
						[],
						{ success_fn: function(data){ self.set("styles_box", data.result); } }
					);
					
				}	
			}
		);
    },
    addContainer: function(container, index){
    	if(typeof index === "undefined" ){
    		this.get("containers").push(container);
    		return true;
    	} else if( typeof index === "number" && index >= 0 ){
    		this.get("containers").splice(index, 0, container);
    		return true;
    	}
    	throw "InvalidArguments Add Container "+container+" "+index;
    },
    sendUpdate: function(val){
    	GRID.log("GridEvent");
    	GRID.log(val);
    }
});

// element models
var Container = Backbone.Model.extend({
	// invokes when the model is created
	initialize: function(spec){

	}
});
var Slot = Backbone.Model.extend({
	// invokes when the model is created
	initialize: function(spec){

	}
});
var Box = Backbone.Model.extend({
	// invokes when the model is created
	initialize: function(spec){

	}
});
// subclasses of Box
var ImageBox = Box.extend({
	// invokes when the model is created
	initialize: function(spec){

	}
});