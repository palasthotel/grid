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

 	//private methods for inner use. Never called from outside.
 	this._tryParseRawData = function(){
 		if(typeof this._raw == "object" ){
 			for (var i = 0; i < this._raw.slots.length; i++) {
 				this.addSlot( new GridSlot(this._raw.slots[i]) );
 			};
 		}
 	};
 	this._tryParseRawData();
};
/** Slot Object */
var GridSlot =  function(server_data){

	// object construction and properties
	this._raw = server_data;
 	this._boxes = [];

 	// public methods
 	this.addBox = function(box){
 		this._boxes.push(box);
 	};
 	this.getAllBoxes = function(){
 		for (var i = 0; i < this._boxes.length; i++) {
 			GRID.log(this._boxes[i]);
 		};
 		return this._boxes;
 	};

 	// private methods for inner use. Never called from outside.
 	this._tryParseRawData = function(){
 		if(typeof this._raw == "object" ){
 			for (var i = 0; i < this._raw.boxes.length; i++) {
 				this.addBox( new GridBox(this._raw.boxes[i]) );
 			};
 		}
 	};
 	this._tryParseRawData();
};

/** Box Object */
var GridBox =  function(server_data){

	//object construction and properties
	this._raw = server_data

	// public methods

	// private methods for inner use. Never called from outside.
};

