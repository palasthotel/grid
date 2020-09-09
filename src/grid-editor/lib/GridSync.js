/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

// ------------------------------------
// ajax Object
// -----------------------------------
var GridAjax = function(method, params_array, settings){
	// two required variables
	var json={};
	json["method"] = method;
	json["params"] = params_array;
	if(typeof settings != "object"){ settings = {}; }
	if(typeof settings.checkIsDraft === "undefined"){ settings.checkIsDraft = true; }
	// default settings
	this.settings = {
		url: GRID.SERVER,
		async: true,
		type: 'POST',
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		error: function(jqXHR, textStatus, error){
			GRID.finishLoading();
   // 			GRID.log("!--- error Method: "+method);
			// GRID.log(jqXHR);
			// GRID.log(textStatus);
			// GRID.log(error);
			// GRID.log(json);
			// GRID.log("--------!");
			if(GRID.DEBUGGING)
			{
				GRID.log(jqXHR.responseText);
				jQuery(".error-messages").html("Method: "+method+"<br>"+
						"Status: ("+jqXHR.status+") -> "+textStatus+"<br>"+
						"ResponseText: <br><pre>"+jqXHR.responseText+"</pre>").show();
			}
			if(typeof settings.error_fn == 'function' ){
				settings.error_fn(jqXHR, textStatus, error);
			}
   		},
   		beforeSend: function(jqXHR, settings){
   			GRID.startLoading();
   		},
   		success: function(data, textStatus, jqXHR){
   			GRID.finishLoading();
   // 			GRID.log("!--- success Method: "+method);
			// GRID.log(data);
			// GRID.log(textStatus);
			// GRID.log(jqXHR);
			// GRID.log(json);
			// GRID.log("---------!");
			GRID.log(["AJAX Success",settings]);
			if(typeof settings.success_fn == 'function' ){
				settings.success_fn(data, textStatus, jqXHR);
			}
			if(settings.checkIsDraft == true){
				GRID.getModel().checkIsDraft();
				GRID.revisions.fetch();
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
	};
	if(!this.settings.wait){ this.send(); }
};

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
			   				grid.set("isDraft",data.result);
			   			},
			   			checkIsDraft: false
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
								grid.getContainers().reset();
								_.each(data.result.container, function(container) {
									GRID.log("Add new Container");
									 grid.addContainer(new Container(container));
								});
								options.success();
								if(options.reverted){
									GRID.flash();
								}
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
							GRID.log(["revertDraft success",data]);
							grid.fetch();
						}
					});
					break;
				case "setToRevision":
					var params = [grid.getGridID(), options.revision];
					new GridAjax("setToRevision",params,{
						success_fn: function(data){
							GRID.log("setToRevision success");
							GRID.log(data);
							grid.fetch({reverted: true});
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
		moveBox: function(box, new_slot, new_box_index, success){
			var params = [
						box.getGridID(),
						box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),
						new_slot.getContainer().get("id"),new_slot.get("id"),new_box_index
					];
			new GridAjax("moveBox", params,{
				success_fn: success
			})
		},
		addReuseContainer: function(containertype, index, success){
			var params = [GRID.ID, index, containertype.get("id")];
			new GridAjax( "addReuseContainer", params,{
				success_fn: success
			});
		},
		destroy: function(grid, options){
			GRID.log("Grid->destroy");
			// no need to. CMS creates and deletes grids
		}
	},
	revisions: function(revisions, options){
		GRID.log("revisions->read");
		var page = (typeof options.page != typeof undefined)? options.page: 0;
		revisions.nextpage = -1;
		new GridAjax(
			"getGridRevisions",
			[revisions.getGridID(), page],
			{
				success_fn: function(data){
					GRID.log("getGridRevisions succes");
					if(data.result.length > 0){
						revisions.nextpage = page+1;
					}
					if(page == 0){
						revisions.reset();
					}
					_.each(data.result, function(revision){
						revisions.add( new Revision(revision) );
					});
				},
			   	checkIsDraft: false
			}
		);
	},
	// type model calls
	containertypes: function(containertypes, options){
		GRID.log("Containertypes->read");
		new GridAjax(
			"getContainerTypes",
			[GRID.ID],
			{
				success_fn: function(data){
					GRID.log("getContainerTypes succes");
					GRID.log(data);
					containertypes.reset();
					_.each(data.result, function(containertype){
						containertypes.add( new ContainerType(containertype) );
					});
				},
			   	checkIsDraft: false
			}
		);
	},
	reusablecontainers: function(collection, options){
		new GridAjax(
			"getReusableContainers", [GRID.ID],
			{
				success_fn: function(data){
					GRID.log(["reusablecontainers data", data]);
					_.each(data.result, function(container) {
						collection.add(new ContainerType(container) );
					});
				},
			   	checkIsDraft: false
			}
		);
	},
	boxtypes: function(boxtypes, options){
		GRID.log("Boxtypes->read");
		new GridAjax(
			"getMetaTypesAndSearchCriteria",
			[GRID.ID],
			{
				success_fn: function(data){
					GRID.log("getMetaTypesAndSearchCriteria succes");
					GRID.log(data);
					_.each(data.result, function(boxtype){
						boxtypes.add( new BoxType(boxtype) );
					});
				},
			   	checkIsDraft: false
			}
		);
	},
	boxblueprints: function(boxblueprints,options){
		var params = [GRID.ID,options.type, options.searchString, options.criteria];
		GRID.log(["blueprints", boxblueprints, options, params]);
		new GridAjax("Search",params,{
				success_fn: function(data){
					GRID.log(["blueprints search",data]);
					_.each(data.result, function(value, key, list){
						var blueprint = new GridBoxBlueprint(value);
						boxblueprints.add(blueprint);
					});
				},
			   	checkIsDraft: false
		});
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
				},
			   	checkIsDraft: false
			}
		);
	},
	rights: function(rights, options){
		GRID.log("Rights->read");
		new GridAjax(
			"Rights",
			[],
			{
				success_fn: function(data){
					GRID.log(["rights",data]);
					_.each(data.result, function(value, key, list){
						rights.set(value,true);
					});
					//rights.setNoRights();
					if(typeof options == typeof {} && typeof options.success == "function"){
						options.success(data);
					}
				},
			   	checkIsDraft: false
			}
		);
	},
	// element model calls
	container: {
		create: function(container, options){
			GRID.log("Container->create");
			var params = [container.getGridID(), container.get("type"), options.index];
			GRID.log(params);
			new GridAjax( "addContainer", params,
				{
					success_fn: function(data){
						GRID.log("addContainer success");
						GRID.log(data);
						container.set("id", data.result.id);
						container.set("slots", data.result.slots);
						container.set("style",data.result.style);
						container.set("space_to_right",data.result.space_to_right);
						container.set("space_to_left",data.result.space_to_left);
						container.setSlots(data.result.slots);
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
			switch(options.action){
				case "reuse":
					var params =[container.getGridID(),container.get("id"),options.reusetitle];
					new GridAjax("reuseContainer", params,{
						success_fn: function(data){
							container.set("reused", true);
							options.success(data);
						},
			   			checkIsDraft: false
					});
					break;
				case "move":
					var params = [container.getGridID(), container.get("id"), options.index];
					new GridAjax("moveContainer", params,{
						success_fn: options.success
					});
					break;
				default:
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
								options.success();
							},
							error_fn: options.error
						}
					);
					break;

			}
		},
		delete: function(container, options){
			var params = [container.getGridID(), container.get("id")];
			GRID.log(params);
			new GridAjax("deleteContainer", params,
				{
				success_fn: function(data){
					GRID.getModel().getContainers().remove(container);
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
			var params = [
						box.getGridID(),
						box.getContainer().get("id"),
						box.getSlot().get("id"),
						// index position in slot
						options.index,
						box.get("type"),
						box.get("content")];
			new GridAjax("createBox",params,
				{
					success_fn: function(data){
						GRID.log("createBox success");
						GRID.log(data);
						box.set("id", data.result.id);
						options.success();
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
					box.trigger('change');
				},
			   	checkIsDraft: false
			});

		},
		update: function(box, options){
			GRID.log("box->update "+options.action);
			// needs a switch for different actions
			switch(options.action){
				case "reuse":
					var params = [
						box.getGridID(),
						box.getSlot().getContainer().get("id"),
						box.getSlot().get("id"),
						box.getIndex()];
						GRID.log(params);
						new GridAjax("reuseBox",params,{
							success_fn: function(data){
								box.attributes=data.result;
								box.trigger('change');
							},
			   				checkIsDraft: false
						});
					break;
				case "move":
					// for moving the box from one to another position
					break;
				default:
					//update attributes
					var attributes = _.clone(box.attributes);
					GRID.log("attributes");
					GRID.log(attributes);
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
							box.fetch();
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

