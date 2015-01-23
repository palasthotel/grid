/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

// ----------------------
// type models
// ---------------------
var ContainerType = GridBackbone.Model.extend({
    getDimension:function(){
        var dimension = "";
        var i = 0;
        _.each( this.get("type").split("-"), function(value, key, list){
            if(value == 0 || i++ == 0) return;
            dimension+= "-"+value;
        });
        return dimension.substring(1);
    },
    getType: function(){
        return this.get("type").split("-")[0];
    },
});
var BoxType = GridBackbone.Model.extend({
    defaults: function(){
        return {
            type: null,
            criteria: null,
            blueprints: null
        }
    },
    getBlueprints: function(){
        if(!(this.blueprints instanceof GridBoxBlueprints)){
            this.blueprints = new GridBoxBlueprints();
        }
        return this.blueprints;
    },
    searchBoxes: function(){
        GRID.log(["BoxType->searchBoxes", this]);
        var blueprints = this.getBlueprints();
        blueprints.fetch({
            type:this.get("type"),
            criteria: this.get("criteria"),
            searchString: ""
        });
        this.set("blueprints", blueprints);
        return blueprints;
    },
    search:function(query,criteria){
        var blueprints = new GridBoxBlueprints();
        blueprints.fetch({
            type:this.get("type"),
            criteria: criteria,
            searchString:query
        });
        return blueprints;
    }
});
var StyleType = GridBackbone.Model.extend({});

// --------------------------
// Revisions model
//  -----------------------

var Revision = GridBackbone.Model.extend({
    initialize: function(spec){
        this.set("id",spec.revision);
    }
});

// ----------------------------------------
// Main model.
// this is the wrapper of the grid elements
//
// -----------------------------------------
var Grid = GridBackbone.Model.extend({
	defaults: function(){
        return {
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
        }
    },
	getGridID: function(){
		return GRID.ID;//this.get("id");
	},
	// invokes when the model is created
    initialize: function (spec) {
    	// Grid object needs an ID
        if (!spec || !spec.id ) {
            throw "InvalidConstructArgs";
        }
        var self = this;
       	this.fetch({
            success: spec.fn_success
        });
    },
    createContainer: function(type, index, reused){
        var self = this;
        var container = new Container({type:type, parent:this});
        if(typeof reused === "undefined"){
            container.set("reused", false);
        } else {
            container.set("reused", reused);
        }
        container.save(null,{
            index:index,
            action: "create",
            // resoinse is always undefined, because we are not using backbones ajax call
            success: function(container, response, options){
                GRID.log("CreateContainerSuccess::");
                GRID.log([container, response, options]);
                self.addContainer(container, index);
            },
            error: function(container, response, options){
                GRID.log("CreateContainerror::");
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
    addReuseContainer: function(containertype, index){
        var self = this;
        GridRequest.grid.addReuseContainer(containertype, index, function(data){
            self.addContainer(new Container(data.result), index);
        });
        return this;
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
    moveBox: function(box, new_slot, new_box_index){
        GridRequest.grid.moveBox(box, new_slot, new_box_index, function(data){
            var clone = box.clone();
            box.getSlot().getBoxes().remove(box);
            new_slot.addBox(clone, new_box_index);
        });
    },
    checkIsDraft: function(){
        GridRequest.grid.read(this, {action: "checkdraft"});
    },
    // handles all Server communication
    sync: function(method, model, options){
    	GridRequest.grid[method](model, options);
    }
});

//---------------------
// element models
// -------------------
var Container =  ContainerType.extend({
    getGrid: function(){
        return this.get("parent");
    },
	getGridID: function(){
		return this.get("parent").getGridID();
	},
	initialize: function(spec){
		var self = this;
        this.setSlots(spec.slots);
        this.set("left_space", this.getSpace("left"));
        this.set("right_space", this.getSpace("right"));
	},
    getSpace: function(side){
        if(typeof side == "undefined") var side = "left";
        space = this.get("space_to_"+side);
        if(space == "" || typeof space == "undefined" || space == null) return 0;
        var space_arr =  space.split("d");
        return (space_arr[0]/space_arr[1]);
    },
    getIndex: function(){
        return this.get("parent").getContainers().indexOf(this);
    },
    setSlots: function(slots_array){
        this.getSlots().reset();
        var self = this;
        var slots_dimension = this.getDimension().split("-");
        var i=0;
        _.each(slots_array, function(slot) {
            slot.dimension = slots_dimension[i++];
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
var Slot = GridBackbone.Model.extend({
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
    createBox: function(blueprint, index){
        var self = this;
        var json = blueprint.toJSON();
        json.parent = this;
        var box = new Box(json);
        box.save(null,{
            index:index,
            // response is always undefined, because we are not using backbones ajax call
            success: function(box, response, options){
                GRID.log("CreateboxSuccess::");
                GRID.log([box, response, options]);
                self.addBox(box, index);
            },
            error: function(box, response, options){
                GRID.log("Createboxrror::");
                GRID.log([box, response, options]);
            }
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
    getBox: function(index){
        return this.getBoxes().at(index);
    },
    sync: function(method, model, options){
    	GridRequest.slot[method](model, options);
    }
});
var Box = GridBackbone.Model.extend({
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