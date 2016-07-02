import Backbone from 'backbone-collection';
import Container from './container';

export default Backbone.Model.extend({
	defaults: function(){
		return {
			id: -1,
			// enable or disable debugging output
			DEBUGGING: false,
			// the server URL
			SERVER: "/grid_ajax_endpoint",
			// Pattern for preview URL
			PREVIEW_URL: window.location.pathname+'/preview',
			// 0 == false == unknown, 1 published, 2 draft
			isDraft: true,
			isSidebar: false,
		}
	},
	getGridID: function(){
		return this.get("id");
	},
	// invokes when the model is created
	initialize: function (spec) {
		// Grid object needs an ID
		if (!spec || !spec.id ) {
			throw "InvalidConstructArgs";
		}
		this.fetch({
			success: spec.fn_success
		});
	},
	createContainer: function(type, index, reused){
		var self = this;
		var container = new Container({type:type, parent:this});
		if(typeof reused === "undefined"){
			container.set("reused", false);
		} else {
			container.set("reused", reused);
		}
		container.save(null,{
			index:index,
			action: "create",
			// resoinse is always undefined, because we are not using backbones ajax call
			success: function(container, response, options){
				GRID.log("CreateContainerSuccess::");
				GRID.log([container, response, options]);
				self.addContainer(container, index);
			},
			error: function(container, response, options){
				GRID.log("CreateContainerror::");
				GRID.log([container, response, options]);
			}
		});
	},
	addContainer: function(element, index){
		if(!(element instanceof Container)) throw "Try to add an not Container Object: Grid.addContainer";
		var args = {};
		if( typeof index === "number" ) args.at = index;
		element.set("parent", this);
		this.getContainers().add(element, args);
	},
	addReuseContainer: function(containertype, index){
		var self = this;
		GridRequest.grid.addReuseContainer(containertype, index, function(data){
			self.addContainer(new Container(data.result), index);
		});
		return this;
	},
	getContainers: function(){
		if(!this.get("collection_containers") ){
			this.set("collection_containers", new Containers());
		}
		return this.get("collection_containers");
	},
	getContainer: function(index){
		return this.getContainers().at(index);
	},
	moveBox: function(box, new_slot, new_box_index){
		GridRequest.grid.moveBox(box, new_slot, new_box_index, function(data){
			var clone = box.clone();
			box.getSlot().getBoxes().remove(box);
			new_slot.addBox(clone, new_box_index);
		});
	},
	checkIsDraft: function(){
		GridRequest.grid.read(this, {action: "checkdraft"});
	},
	// handles all Server communication
	sync: function(method, model, options){
		if(typeof GridRequest.grid[method] == "function"){
			GridRequest.grid[method](model, options);
		} else {
			GRID.log("grid sync metod not defined "+method);
		}

	}
});