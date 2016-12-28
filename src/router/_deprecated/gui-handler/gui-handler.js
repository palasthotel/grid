"use strict";

import {Events} from '../../constants';
import ContainerHandler from './component/container-handler';
import BoxHandler from './component/box-handler';

/**
 * Handles all GUI events
 */
export default class GUIHandler{
	/**
	 *
	 * @param {func} getState get state of router component
	 * @param {func} setState set state of router component
	 * @param {GridEvent} events object
	 * @param {Backend} backend for ajax calls
	 * @param {object} config of grid
	 * @param {Array} additional handlers
	 */
	constructor(getState, setState, events, backend, config,  additional = []){
		
		/**
		 * core handlers
		 */
		this.handlers={};
		
		/**
		 * listen to gui events
		 */
		
		// container events
		const container_handler = new ContainerHandler(getState, setState, events, backend, config);
		
		
		// box events
		const box_handler = new BoxHandler(getState, setState, events, backend, config);
		
	}
	
}