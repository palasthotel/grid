
export default ContainerType.extend({
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