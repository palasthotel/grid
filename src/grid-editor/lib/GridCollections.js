/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import GridBackbone from 'backbone'

window.Revisions = GridBackbone.Collection.extend({
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

// type collections
window.ContainerTypes = GridBackbone.Collection.extend({
	model: ContainerType,
	sync: function(method, collection, options){
		GridRequest.containertypes(collection, options);
	}
});
window.ReusableContainers = GridBackbone.Collection.extend({
	model: ContainerType,
	sync: function(method, collection, options){
		GridRequest.reusablecontainers(collection, options);
	}
});
window.BoxTypes = GridBackbone.Collection.extend({
	model: BoxType,
	sync: function(method, collection, options){
		GridRequest.boxtypes(collection, options);
	}
});
window.Styles = GridBackbone.Collection.extend({
	model: StyleType,
	initialize: function(spec){
		if (!spec || !spec.type ) {
            throw "InvalidConstructArgs Styles";
        }
        this.type = spec.type;
	},
	sync: function(method, collection, options){
		GridRequest.styles(collection, options);
	}
});

// element collections
window.Containers = GridBackbone.Collection.extend({
	model: Container,
	move: function(container, to_index){
		var self = this;
		GridRequest.container.update(container,{
			action: "move",
			index: to_index,
			success: function(data){
				self.remove(container);
				self.add(container, {at:to_index});
			}
		});
		return this;
	}
});
window.Slots = GridBackbone.Collection.extend({
	model: Slot
});
window.Boxes = GridBackbone.Collection.extend({
	model: Box
});

