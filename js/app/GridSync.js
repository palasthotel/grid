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
		},
		read: function(grid, options){
			GRID.log("Grid->update "+options.action);
			switch(options.action){
				case "checkdraft":
					// get status draft oder published
			   		new GridAjax("checkDraftStatus",[grid.getGridID()],{
			   			success_fn: function(data){
			   				GRID.log("checkDraftStatus success");
			   				GRID.log(data);
			   				grid.set("isDraft",data.result);
			   			}
			   		});
					break;
				default:
					// load whole grid
					new GridAjax(
						"loadGrid",
						[grid.getGridID()],
						{ 
							success_fn: function(data){
								grid.attributes = _.extend(grid.attributes, data.result);
								GRID.log();
								_.each(data.result.container, function(container) {
									GRID.log("Add new Container");
									 grid.addContainer(new Container(container));
								});

								var boxtypes = new BoxTypes();
								boxtypes.fetch();
								grid.set("types_box", boxtypes);

								var containertypes = new ContainerTypes();
								containertypes.fetch();
								grid.set("types_container", containertypes);

								var containerstyles = new Styles({type: "Container"});
								containerstyles.fetch();
								grid.set("styles_container", containerstyles);

								var slotstyles = new Styles({type: "Slot"});
								slotstyles.fetch();
								grid.set("styles_slot", slotstyles);

								var boxstyles = new Styles({type: "Box"});
								boxstyles.fetch();
								grid.set("styles_box", boxstyles);

								var revisions = new Revisions({grid: grid});
								revisions.fetch();
								grid.set("revisions", revisions);

							}	
						}
					);
			}
			
		},
		update: function(grid, options){
			GRID.log("Grid->update");
			switch(options.action){
				case "revertDraft":
					new GridAjax("revertDraft", [grid.getGridID()],{
						success_fn: function(data){
							GRID.log("revertDraft success");
							GRID.log(data);
						}
					});
					break;
				case "setToRevision":
					var params = [grid.getGridID(), options.revision.get("revision")];
					new GridAjax("setToRevision",params,{
						success_fn: function(data){
							GRID.log("setToRevision success");
							GRID.log(data);
						}
					});
					break;
				default:
					// publish
					new GridAjax("publishDraft",[ grid.getGridID()], {
						success_fn: function(data){
							GRID.log("publishDraft success");
							GRID.log(data);
							grid.set("isDraft", false);
						}
					});
			}
		},
		destroy: function(grid, options){
			GRID.log("Grid->destroy");
			// no need to. CMS creates and deletes rids
		}
	},
	revisions: function(revisions, options){
		GRID.log("revisions->read");
		new GridAjax(
			"getGridRevisions",
			[revisions.getGridID()],
			{ 
				success_fn: function(data){ 
					GRID.log("getGridRevisions succes");
					GRID.log(data);
					revisions.reset();
					_.each(data.result, function(revision){
						revisions.add( new Revision(revision) );						
					});
				} 
			}
		);
	},
	// type model calls
	containertypes: function(containertypes, options){
		GRID.log("Containertypes->read");
		new GridAjax(
			"getContainerTypes",
			[],
			{ 
				success_fn: function(data){ 
					GRID.log("getContainerTypes succes");
					GRID.log(data);
					containertypes.reset();
					_.each(data.result, function(containertype){
						containertypes.add( new ContainerType(containertype) );						
					});
				} 
			}
		);
	},
	boxtypes: function(boxtypes, options){
		GRID.log("Boxtypes->read");
		new GridAjax(
			"getMetaTypesAndSearchCriteria",
			[],
			{ 
				success_fn: function(data){ 
					GRID.log("getMetaTypesAndSearchCriteria succes");
					GRID.log(data);
					_.each(data.result, function(boxtype){
						boxtypes.add( new BoxType(boxtype) );						
					});
				} 
			}
		);
	},
	styles: function(styles, options){
		GRID.log(styles.type+"Styles->read");
		new GridAjax(
			"get"+styles.type+"Styles",
			[],
			{ 
				success_fn: function(data){ 
					GRID.log("get"+styles.type+"Styles succes");
					GRID.log(data);
					styles.reset();
					_.each(data.result, function(style){
						styles.add( new StyleType(style) );						
					});
				} 
			}
		);
	},
	// element model calls
	container: {
		create: function(container, options){
			GRID.log("Container->create");
			GRID.log(options);
			var params = [container.getGridID(), container.get("type"), options.index];
			GRID.log(params);
			new GridAjax( "addContainer", params,
				{
					success_fn: function(data){
						GRID.log("addContainer success")
						GRID.log(data);
						options.success();
					}
				}
			);
		},
		read: function(container, options){
			GRID.log("Container->read");
			// no need to at the moment
		},
		update: function(container, options){
			GRID.log("Container->update");
			var attributes = _.clone(container.attributes);
			delete(attributes.slots); 
			delete(attributes.collection_slots);	
			delete(attributes.classes);
			delete(attributes.parent);		
			var params =[container.getGridID(), container.get("id"),attributes];
			GRID.log(params);			
			new GridAjax("updateContainer", params,
				{
					success_fn: function(data){
						GRID.log("updateContainer success");
						GRID.log(data);
						options.success();
					},
					error_fn: options.error
				}
			);
		},
		delete: function(container, options){
			GRID.log("container->destroy");
			var params = [container.getGridID(), container.get("id")];
			GRID.log(params);
			new GridAjax("deleteContainer", params,
				{
				success_fn: function(data){
					GRID.log("deleteContainer success");
					GRID.log(data);
					options.success();
				}
			});
		}
	},
	slot: {
		create: function(slot, options){
			GRID.log("slot->create");
			// no need to, because they are hard connected to their container
		},
		read: function(slot, option){
			GRID.log("slot->read");
			// no need to at the moment
		},
		update: function(slot, options){
			GRID.log("slot->update");
			var params = [slot.getGridID(), slot.get("parent").get("id"),slot.get("id"),slot.get("style")];
			GRID.log(params);
			new GridAjax("updateSlotStyle",params,
				{
					success_fn: function(data){
						GRID.log("updateSlotStyle success");
						options.success();
					}	
				}
			);
		},
		delete: function(slot, options){
			GRID.log("slot->destroy");
			// not possible
		}
	},
	box: {
		create: function(box, options){
			GRID.log("box->create");
			// create a new box
			params = [
						box.getGridID(), 
						box.getContainer().get("id"), 
						box.getSlot().get("id"),
						// index position in slot 
						options.index, 
						// box type
						options.type,
						// the content of the box
						// -> like content structure in box-php-file 
						options.content];
			new GridAjax("createBox",params,
				{
					success_fn: function(data){
						GRID.log("createBox success");
						GRID.log(data);
					}
				}
			);
		},
		read: function(box, option){
			GRID.log("box->read");
			var params = [box.getGridID(), box.getContainer().get("id"), box.getSlot().get("id"), box.getIndex()];
			GRID.log(params);
			new GridAjax("fetchBox",params,{
				success_fn: function(data){
					GRID.log("fetchBox success");
					GRID.log(data);
					box.attributes = _.extend(box.attributes, data.result);
				}
			});
			
		},
		update: function(box, options){
			GRID.log("box->update "+options.action);
			// needs a switch for different actions
			switch(options.action){
				case "move":
					// for moving the box from one to another position
					break;
				default:
					//update attributes
					GRID.log("attributes");
					var attributes = _.clone(box.attributes);
					delete(attributes.classes);
					delete(attributes.contentstructure);
					delete(attributes.parent);
					var params = [
						box.getGridID(), 
						box.getSlot().getContainer().get("id"), 
						box.getSlot().get("id"), 
						box.getIndex(), 
						attributes
					];
					GRID.log(params);
					new GridAjax("UpdateBox",params,{
						success_fn: function(data){
							GRID.log("UpdateBox success");
							GRID.log(data);
							options.success();
						}
					});
			}
		},
		delete: function(box, options){
			GRID.log("box->destroy");
			var params = [ box.getGridID(), box.getContainer().get("id"), box.getSlot().get("id"), box.getIndex() ];
			GRID.log(params);
			new GridAjax("removeBox", params,
				{
					success_fn: function(data){
						GRID.log("removeBox success");
						GRID.log(data);
						options.success();
					}
				}
			);
		}
	}
};

