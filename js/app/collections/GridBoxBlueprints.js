var GridBoxBlueprints = Backbone.Collection.extend({
	model: GridBoxBlueprint,
	initialize: function(spec){
		GRID.log(["INIT GridBoxBlueprints", spec]);
	},
	sync: function(method, collection, options){
		GRID.log(["Sync GridBoxBlueprints", method, collection, options]);
		GridRequest.boxblueprints(this, options);
	}
});