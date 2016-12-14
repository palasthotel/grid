/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

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