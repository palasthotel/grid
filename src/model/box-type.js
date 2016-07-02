import Backbone from 'backbone-collection';

export default Backbone.Model.extend({
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