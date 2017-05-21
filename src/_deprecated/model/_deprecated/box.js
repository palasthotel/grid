import Backbone from 'backbone-collection';

export default Backbone.Model.extend({
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
		return this.get("parent").onSearch().indexOf(this);
	},
	// handles all Server communication
	sync: function(method, model, options){
		// GridRequest.box[method](model, options);
	}
});