// ----------------------------------------
// Main model.
// this is the wrapper of the grid elements
//
// -----------------------------------------
var Grid = Backbone.Model.extend({
	defaults :{
        id: -1,
		// enable or disable debugging output
		DEBUGGING: false,
		// the server URL
		SERVER: "/grid_ajax_endpoint",
		// Pattern for preview URL
		PREVIEW_URL: window.location.pathname+'/preview',
		// 0 == false == unknown, 1 published, 2 draft
		isDraft: true,
        isSidebar: false,
        types_box: null,
        types_container: null,
        styles_container: null,
        styles_slot: null,
        styles_box: null,
        revisions: null,
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

        this.set("types_box", new BoxTypes() );
        this.set("types_container", new ContainerTypes() );
        this.set("styles_container", new Styles({type:"container"}) );
        this.set("styles_box", new Styles({type:"box"}) );

       	this.fetch();
        this.set("revisions", new Revisions({grid: this}) );
        this.get("revisions").fetch();
    },
    createContainer: function(type, index){
        var self = this;
        var container = new Container({type:type, parent:this});
        container.save(null,{
            index:index,
            // resoinse is always undefined, because we are not using backbones ajax call
            success: function(container, response, options){
                GRID.log("CreateContainerSuccess::");
                GRID.log([container, response, options]);
                self.addContainer(container, index);
            },
            error: function(container, response, options){
                GRID.log("CreateContainerrror::");
                GRID.log([container, response, options]);
            }
        });
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
    getContainer: function(index){
        return this.getContainers().at(index);
    },
    getContainerTypes: function(){
        if(!(this.get("types_container") instanceof ContainerTypes) ){
            this.set("types_container", new ContainerTypes());
        }
        return this.get("types_container");
    },
    getBoxTypes: function(){
        if(!(this.get("types_box") instanceof BoxTypes) ){
            this.set("types_box", new BoxTypes());
        }
        return this.get("types_box");
    },
    getSlotStyles: function(){
        if(!(this.get("styles_slot") instanceof Styles) ){
            this.set("styles_slot", new Styles({type:"slot"}));
        }
        return this.get("styles_slot");
    },
    getIsDraft: function(){
        GridRequest.grid.read( this, { action: "checkdraft" } );
        return this.get("isDraft"); 
    },
    setToRevision: function(revision){
        GridRequest.grid.update(this, {action: "setToRevision", revision: revision});
    },
    // handles all Server communication
    sync: function(method, model, options){
    	GridRequest.grid[method](model, options);
    }
});

var Revision = Backbone.Model.extend({
    initialize: function(spec){
        this.set("id",spec.revision);
    }
})

// ----------------------
// type models
// ---------------------
var ContainerType = Backbone.Model.extend({});
var BoxType = Backbone.Model.extend({});
var StyleType = Backbone.Model.extend({});

//---------------------
// element models
// -------------------
var Container = Backbone.Model.extend({
    getGrid: function(){
        return this.get("parent");
    },
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
    getIndex: function(){
        return this.get("parent").getContainers().indexOf(this);
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
    getSlot: function(index){
        return this.getSlots().at(index);
    },
    getGrid: function(){
        return this.get("parent");
    },
    // handles all Server communication
    sync: function(method, model, options){
    	GridRequest.container[method](model, options);
    }
});
var Slot = Backbone.Model.extend({
    getGrid: function(){
        return this.get("parent").getGrid();
    },
	getGridID: function(){
		return this.get("parent").getGridID();
	},
    getContainer: function(){
        return this.get("parent");
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
    createBox: function(index, box_type){

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
    getBox: function(index){
        return this.getBoxes().at(index);
    },
    sync: function(method, model, options){
    	GridRequest.slot[method](model, options);
    }
});
var Box = Backbone.Model.extend({
    getGrid: function(){
        return this.get("parent").getGrid();
    },
	getGridID: function(){
		return this.get("parent").getGridID();
	},
    getSlot: function(){
        return this.get("parent");
    },
    getContainer: function(){
        return this.getSlot().getContainer();
    },
    getGrid:function(){
        return this.getContainer().getGrid();
    },
	initialize: function(spec){

	},
    getIndex: function(){
        return this.get("parent").getBoxes().indexOf(this);
    },
    // handles all Server communication
    sync: function(method, model, options){
    	GridRequest.box[method](model, options);
    }
});
// subclasses of Box
var ImageBox = Box.extend({
	initialize: function(spec){

	}
});