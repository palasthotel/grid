var GridRights = GridBackbone.Model.extend({
    initialize: function(spec){

    },
	sync: function(method, model, options){
		GridRequest.rights(model, options);
	}
});