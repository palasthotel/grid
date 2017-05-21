import Backbone from 'backbone-collection';

export default Backbone.Model.extend({
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
		// GridRequest.slot[method](model, options);
	}
});