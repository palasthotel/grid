"use strict";

import {Events} from '../../constants.js';

import GridDocumentHandler from './component/grid.document.js';
import GridEditingBoxHandler from './component/grid.editing.box.js';
import GridEditingContainerHandler from './component/grid.editing.container.js';
import GridPermissionsHandler from './component/grid.permissions.js';
import GridStylesHandler from './component/grid.styles.js';
import GridTestHandler from './component/grid.test.js';
import GridWidgetsTypeAHeadBoxHandler from './component/grid.widgets.typeahead.box.js';

/**
 * Handles all answers from backend
 */
export default class BackendHandler{
	/**
	 *
	 * @param {func} getState get state of router component
	 * @param {func} setState set state of router component
	 * @param {GridEvent} events object
	 * @param {Array} additional handlers
	 */
	constructor(getState, setState, events, additional = []){
		
		/**
		 * core handlers
		 */
		this.handlers={};
		this.handlers["grid.document"] = new GridDocumentHandler(getState, setState, events);
		this.handlers["grid.editing.box"] = new GridEditingBoxHandler(getState, setState, events);
		this.handlers["grid.editing.container"] = new GridEditingContainerHandler(getState, setState, events);
		this.handlers["grid.permissions"] = new GridPermissionsHandler(getState, setState, events);
		this.handlers["grid.styles"] = new GridStylesHandler(getState, setState, events);
		this.handlers["grid.test"] = new GridTestHandler(getState, setState, events);
		this.handlers["grid.widgets.typeahead.box"] = new GridWidgetsTypeAHeadBoxHandler(getState, setState, events);
		
		/**
		 * additional handlers for plugins for example
		 */
		for(let item of additional){
			if(typeof item != typeof {}){
				console.error(item);
				throw "Additional handler configuration must be of type object and have 'component' String and 'handler' function as attributes.";
			}
			if(typeof item.component != typeof ""){
				console.error(item);
				throw "'component' attribute of Handler must be string.";
			}
			if(typeof item.handler != "function"){
				console.error(item);
				throw "'handler' attribute of Handler must be a function.";
			}
			this.handlers[item.component] = new item.handler(getState,setState,events,item);
		}
		
		/**
		 * listen to backend event from ajax calls
		 */
		events.on(Events.BACKEND,this.onBackend.bind(this));
	}
	
	/**
	 * on every backend call this tries to route to handler
	 * @param result
	 */
	onBackend(result){
		if(typeof this.handlers[result.component] != typeof undefined &&
			typeof this.handlers[result.component][result.method] != typeof undefined){
			this.handlers[result.component][result.method](result);
		} else {
			console.info("No handler for this", result);
		}
	}
	
}