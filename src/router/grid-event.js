"use strict";

import {EventEmitter} from 'events';
import Events from '../helper/constants.js';

const grid_events = new EventEmitter();
grid_events.setMaxListeners(0);


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

export default class GridEvent {
	/**
	 * listed events
	 */
	Events(){
		return Events;
	}
	
	/**
	 * emit an event
	 * @param key
	 * @param payload
	 */
	emit(key, payload) {
		grid_events.emit(getKey(key), payload);
	}
	
	/**
	 * listen for event
	 * @param key
	 * @param callback
	 */
	on(key, callback) {
		grid_events.addListener(getKey(key), callback);
	}
}
