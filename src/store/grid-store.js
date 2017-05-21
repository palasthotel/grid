'use strict';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {gridReducer} from '../reducer';

export function createGridStore(state = {
	// ui states
	ui: {},

	// grid state
	grid: {},

	// others
	revisions: [],
	container_types: [],
	box_types: [],
	rights: [],
	styles: [],

}){

	let middleware = null;
	if (process.env.NODE_ENV !== 'production') {
		const logger = store => next => action => {
			if(typeof action !== "function") console.log('dispatching', action);
			const result = next(action);
			// console.log('next state', store.getState());
			return result;
		};
		middleware = applyMiddleware(logger, thunk );
	} else {
		middleware = applyMiddleware(thunk);
	}

	return createStore(gridReducer, state, middleware);
}