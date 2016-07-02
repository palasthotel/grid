import Backbone from 'backbone-collection';

export default Backbone.Model.extend({
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
