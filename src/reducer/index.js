'use strict';

import {
	REQUEST_GRID_DOCUMENT_REVISIONS,
	REQUEST_GRID_STYLES_GET,
	REQUEST_GRID_PERMISSION_RIGHTS,
	REQUEST_GRID_CONTAINER_EDITING_GET_TYPES,
	REQUEST_GRID_BOX_EDITING_META_TYPES,
	REQUEST_GRID_BOX_EDITING_SEARCH,
} from '../actions/types';

import updateUI from './update-ui';
import updateGrid from './update-grid';

function boxEditor(state, action){
	return state;
}

function containerEditor(state, action){
	return state;
}

function updateRevisions(state, action) {
	switch (action.type){
		case REQUEST_GRID_DOCUMENT_REVISIONS:
			return [
				...action.payload.revisions,
			]
	}
	return state;
}
function updateStyles(state, action) {
	switch (action.type){
		case REQUEST_GRID_STYLES_GET:
			return {
				...action.payload.styles,
			}
	}
	return state;
}
function updateRights(state, action) {
	switch (action.type){
		case REQUEST_GRID_PERMISSION_RIGHTS:
			return {
				...action.payload.rights,
			}
	}
	return state;
}

function updateBoxTypes(state, action){
	switch (action.type) {
		case REQUEST_GRID_BOX_EDITING_META_TYPES:
			return [
				...action.payload.box_types
			];
		case REQUEST_GRID_BOX_EDITING_SEARCH:
			const types = [];
			for(const i in state){
				const box_type = {...state[i]};
				if(box_type.type === action.payload.box_meta_type){
					box_type.boxes = action.payload.boxes;
				}
				types.push(box_type)
			}

			console.log(state, types);

			return types
		default:
			return state;
	}
}

// this way
export function gridReducer(state = {}, action) {
	// important never mutate, but always create new object
	return {

		revisions: updateRevisions(state.revisions, action),
		styles: updateStyles(state.styles, action),
		rights: updateRights(state.rights, action),

		ui: updateUI(state.ui, action),

		grid: updateGrid(state.grid, action),

		box_editor: boxEditor(state.box_editor, action),
		container_editor: containerEditor(state.container_editor, action),

		container_types: (action.type === REQUEST_GRID_CONTAINER_EDITING_GET_TYPES)? action.payload.container_types: state.container_types,

		box_types: updateBoxTypes(state.box_types, action),
	}
}

// or this way
// import { combineReducers } from 'redux'
// const grid_app = combineReducers({
//   box_editor: box_editor(state.box_editor, action),
//   container_editor: box_editor(state.container_editor, action),
//   grid: update_grid(state.grid, action),
// })
