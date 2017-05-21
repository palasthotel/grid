import Backbone from 'backbone-collection';

module.exports = Backbone.Model.extend({
	initialize: function(spec){
		this.set("id",spec.revision);
	}
});