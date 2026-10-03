/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

import _ from 'underscore'

window.GridRights = GridBackbone.Model.extend({
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