/** 
*	@author Edward
*	Models for the Grid
*	
*	Container, Slots, Boxes
*	with Grid Prefix to prevent collisions
*
*/

/** Container Object */
var GridContainer =  function(server_data){
	GRID.log(server_data);
	// object construction and properties
	this._raw = server_data;
 	this._slots = [];

 	//public methods
 	this.addSlot = function(slot){
 		this._slots.push(slot);
 	};
 	this.getAllSlots = function(){
 		for (var i = 0; i < this_slots.length; i++) {
 			GRID.log(this._slots[i]);
 		};
 		return this._slots;
 	};
 	this.remove = function(){
 		var self = this;
 		GRID.log("remove");
 		new GridAjax(
 			"deleteContainer",
 			[GRID.ID, this._id],
 			{
 				success_fn: function(response){
 					GRID.log("gelöscht");
 					GRID.log(response);
 					GRID.removeContainer(self);
 				}
 			}
 		);
 	};

 	//private methods for inner use. Never called from outside.
 	this._tryParseRawData = function(){
 		if(typeof this._raw == "object" ){
 			for (var i = 0; i < this._raw.slots.length; i++) {
 				this.addSlot( new GridSlot(this._raw.slots[i], this) );
 			};
 		}
 		this._id = this._raw.id;
 	};
 	this._tryParseRawData();
};

/** Slot Object */
var GridSlot =  function(server_data, container){
	GRID.log(server_data);
	// object construction and properties
	this._raw = server_data;
 	this._boxes = [];
 	this._container = container;

 	// public methods
 	this.addBox = function(box){
 		this._boxes.push(box);
 	};
 	this.removeBox = function(box){
 		this._boxes.splice(this._boxes.indexOf(box),1);
 	};
 	this.getAllBoxes = function(){
 		for (var i = 0; i < this._boxes.length; i++) {
 			GRID.log(this._boxes[i]);
 		};
 		return this._boxes;
 	};

 	this.getStyles = function(){

 	};

 	// private methods for inner use. Never called from outside.
 	this._tryParseRawData = function(){
 		if(typeof this._raw == "object" ){
 			for (var i = 0; i < this._raw.boxes.length; i++) {
 				this.addBox( new GridBox(this._raw.boxes[i], this) );
 			};
 		}
 		this._id = this._raw.id;
 	};
 	this._tryParseRawData();
};

/** Box Object */
var GridBox =  function(server_data, slot){
	GRID.log(server_data);
	//object construction and properties
	this._raw = server_data
	this._slot = slot;

	// public methods
	this.remove = function(){
		var self = this;
		new GridAjax(
 			"removeBox",
 			[GRID.ID,this._slot._container._id,this._slot._id,this.getIndex()],
 			{
 				success_fn: function(response){
 					GRID.log("Box gelöscht");
 					GRID.log(response);
 					self._slot.removeBox(self);
 				}
 			}
 		);
	};

	this.getIndex = function(){
		return this._slot._boxes.indexOf(this);
	}

	// private methods for inner use. Never called from outside.
	this._tryParseRawData = function(){
 		this._id = this._raw._id;
 	};
 	this._tryParseRawData();
};

