
var Grid = Backbone.Model.extend({
	defaults :{
		// enable or disable debugging output
		DEBUGGING: false,
		// the server URL
		SERVER: "/grid_ajax_endpoint",
		// Pattern for preview URL
		PREVIEW_URL: window.location.pathname+'/preview',
		// 0 == false == unknown, 1 published, 2 draft
		state: 1
	},
	getGridID: function(){
		return this.get("id");
	},
	// invokes when the model is created
    initialize: function (spec) {
    	// Grid object needs an ID
        if (!spec || !spec.id ) {
            throw "InvalidConstructArgs";
        }
        var self = this;
       	this.fetch();
    },
    addContainer: function(element, index){
    	if(!(element instanceof Container)) throw "Try to add an not Container Object: Grid.addContainer";
    	var args = {};
    	if( typeof index === "number" ) args.at = index;
    	element.set("parent", this);
    	this.getContainers().add(element, args);
    },
    getContainers: function(){
    	if(!this.get("collection_containers") ){
    		this.set("collection_containers", new Containers());
    	}
    	return this.get("collection_containers");
    },
    sendUpdate: function(val){
    	GRID.log("GridEvent sendUpdate");
    	GRID.log(val);
    },
    sync: function(method, model, options){
    	GridRequest.grid[method](model, options);
    }
});

// element models
var Container = Backbone.Model.extend({
	getGridID: function(){
		return this.get("parent").getGridID();
	},
	initialize: function(spec){
		var self = this;
		GRID.log("init container");
		GRID.log(spec.slots);
		_.each(spec.slots, function(slot) {
			GRID.log("add Slot");
			GRID.log(slot);
			 self.addSlot(new Slot(slot));
		});
	},
	addSlot: function(element, index){
    	if(!(element instanceof Slot)) throw "Try to add an not Slot Object: Container.addSlot";
    	var args = {};
    	if( typeof index === "number" ) args.at = index;
    	element.set("parent", this);
    	this.getSlots().add(element, args);
    },
    getSlots: function(){
    	if(!this.get("collection_slots") ){
    		this.set("collection_slots", new Slots());
    	}
    	return this.get("collection_slots");
    },
    sync: function(method, model, options){
    	GridRequest.container[method](model, options);
    }
});
var Slot = Backbone.Model.extend({
	getGridID: function(){
		return this.get("parent").getGridID();
	},
	initialize: function(spec){
		var self = this;
		GRID.log("init Slot");
		GRID.log(spec);
		_.each(spec.boxes, function(box){
			GRID.log("add Box");
			self.addBox(new Box(box));
		});
	},
	addBox: function(element, index){
		if(!(element instanceof Box)) throw "Try to add an not Box Object: Slot.addBox";
    	var args = {};
    	if( typeof index === "number" ) args.at = index;
    	element.set("parent", this);
    	this.getBoxes().add(element, args);
    },
    getBoxes: function(){
    	if(!this.get("collection_boxes") ){
    		this.set("collection_boxes", new Boxes());
    	}
    	return this.get("collection_boxes");
    },
    sync: function(method, model, options){
    	GridRequest.slot[method](model, options);
    }
});
var Box = Backbone.Model.extend({
	getGridID: function(){
		return this.get("parent").getGridID();
	},
	initialize: function(spec){

	},
    sync: function(method, model, options){
    	GridRequest.box[method](model, options);
    }
});
// subclasses of Box
var ImageBox = Box.extend({
	initialize: function(spec){

	}
});