import Backbone from 'backbone-collection';

module.exports =  Backbone.Collection.extend({
	model: Revision,
	initialize: function(spec){
		if(!spec || !spec.grid ||!(spec.grid instanceof Grid )){
			throw "InvalidConstructArgs Revisions need a Grid"
		}
		this.grid = spec.grid;
	},
	getGridID: function(){
		GRID.log(this);
		return this.grid.getGridID();
	},
	sync: function(method, collection, options){
		GridRequest.revisions(collection, options);
	}
});