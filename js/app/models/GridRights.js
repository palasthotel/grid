var GridRights = GridBackbone.Model.extend({
    initialize: function(spec){

    },
    setNoRights: function(){
    	var self = this;
    	_.each(this.attributes, function(value, key, list){
    		self.set(key, false);
    	});
    },
    logRights: function(){
    	_.each(this.attributes, function(value, key, list){
    		GRID.log(key+" "+value);    	
    	});
    },
	sync: function(method, model, options){
		GridRequest.rights(model, options);
	}
});