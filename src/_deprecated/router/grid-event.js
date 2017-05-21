"use strict";

import {EventEmitter} from 'events';
import Events from '../constants.js';

/**
 * always same event emitter on all instances
 */
const grid_events = new EventEmitter();
grid_events.setMaxListeners(0);

export default class GridEvent {
	
	/**
	 * set global as object property
	 */
	constructor(){
		this._events = grid_events;
	}
	
	/**
	 * emit an event
	 * @param key
	 */
	emit(key) {
		/**
		 * all arguments but key
		 */
		const args = [];
		for(let i = 1; i < arguments.length; i++){
			args.push(arguments[i]);
		}
		/**
		 * emit the event
		 */
		this._events.emit(getKey(key), ...args);
	}
	
	/**
	 *
	 * @param key
	 * @param callback
	 */
	on(key, callback) {
		this._events.addListener(getKey(key), callback);
	}
	
	/**
	 *
	 * @param key
	 * @param callback
	 */
	off(key, callback){
		this._events.removeListener(getKey(key), callback);
	}
}

/**
 * key object handler
 * @param key
 * @return {*}
 */
const getKey = function(key){
	if(typeof key == typeof {} && typeof key.key == typeof ""){
		if(typeof key.key == typeof ""){
			// fallback if no key but event object
			key = key.key;
		}else {
			throw new Error("No valid event key",key);
		}
	}
	return key;
}