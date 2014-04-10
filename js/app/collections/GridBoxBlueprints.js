var GridBoxBlueprints = GridBackbone.Collection.extend({
	model: GridBoxBlueprint,
	initialize: function(spec){
	},
	sync: function(method, collection, options){
		GridRequest.boxblueprints(collection, options);
	}
});