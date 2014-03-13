// ------------------------------------
// ajax Object
// -----------------------------------
var GridAjax = function(method, params_array, settings){
	// two required variables
	json["method"] = method;
	json["params"] = params_array;
	if(typeof settings != "object"){ settings = {}; }
	// default settings
	this.settings = {
		url: GRID.SERVER,
		async: true,
		type: 'POST',
		dataType: 'json',
		error: function(jqXHR, textStatus, error){
   // 			GRID.log("!--- error Method: "+method);
			// GRID.log(jqXHR);
			// GRID.log(textStatus);
			// GRID.log(error);
			// GRID.log(json);
			// GRID.log("--------!");
			if(typeof settings.error_fn == 'function' ){
				settings.error_fn(jqXHR, textStatus, error);
			}
   		},
   		success: function(data, textStatus, jqXHR){
   // 			GRID.log("!--- success Method: "+method);
			// GRID.log(data);
			// GRID.log(textStatus);
			// GRID.log(jqXHR);
			// GRID.log(json);
			// GRID.log("---------!");
			if(typeof settings.success_fn == 'function' ){
				settings.success_fn(data, textStatus, jqXHR);
			}
   		},
   		data: JSON.stringify(json),
   		wait: false
	};
	// overwrite settings
	jQuery.extend(true,this.settings, settings);
	// sends the request to the server
	this.send = function(){
		jQuery.ajax(this.settings);
	}
	if(!this.settings.wait){ this.send(); }
}

// -------------------
// Method-map that uses the GridAjax object for server communication
// ------------------
var GridRequest = {
	grid: {
		create: function(grid, options){
			GRID.log("Request grid create");
			[grid.getGridID(), containerType, $temp.index()]
			new GridAjax(
				"addContainer",
				[],
				{
					success_fn: function(data){
						GRID.log("addContainer success")
						GRID.log(data);
					}
				}
			);
		},
		read: function(grid, options){
			new GridAjax(
				"loadGrid",
				[grid.getGridID()],
				{ 
					success_fn: function(data){
						_.each(data.result.container, function(container) {
							GRID.log("Add new Container");
							 grid.addContainer(new Container(container));
						});
						new GridAjax(
							"getMetaTypesAndSearchCriteria",
							[],
							{ success_fn: function(data){ grid.set("types_box", data.result); } }
						);
						new GridAjax(
							"getContainerTypes",
							[],
							{ success_fn: function(data){ grid.set("types_container", data.result); } }
						);
						new GridAjax(
							"getContainerStyles",
							[],
							{ success_fn: function(data){ grid.set("styles_container", data.result); } }
						);
						new GridAjax(
							"getSlotStyles",
							[],
							{ success_fn: function(data){ grid.set("styles_slot", data.result); } }
						);
						new GridAjax(
							"getBoxStyles",
							[],
							{ success_fn: function(data){ grid.set("styles_box", data.result); } }
						);
					}	
				}
			);
		},
		update: function(grid, options){
			GRID.log("Grid->update");
		},
		destroy: function(grid, options){
			GRID.log("Grid->create");
		}
	},
	container: {
		create: function(container, options){
			GRID.log("Container->create");
		},
		read: function(container, option){
			GRID.log("Container->read");
		},
		update: function(container, options){
			GRID.log("Container->update");
		},
		delete: function(container, options){
			GRID.log("container->destroy");
		}
	},
	slot: {
		create: function(slot, options){
			GRID.log("slot->create");
		},
		read: function(slot, option){
			GRID.log("slot->read");
		},
		update: function(slot, options){
			GRID.log("slot->update");
		},
		delete: function(slot, options){
			GRID.log("slot->destroy");
		}
	},
	box: {
		create: function(box, options){
			GRID.log("box->create");
		},
		read: function(box, option){
			GRID.log("box->read");
		},
		update: function(box, options){
			GRID.log("box->update");
		},
		delete: function(box, options){
			GRID.log("box->destroy");
		}
	}
};

