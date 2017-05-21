'use strict';

import {
	findSlot,
} from '../helper/store-iterator'

import {
	REQUEST_GRID_DOCUMENT_LOAD,
	REQUEST_GRID_DOCUMENT_CHECK_DRAFT_STATE,
	REQUEST_GRID_DOCUMENT_REVERT_DRAFT,
	REQUEST_GRID_DOCUMENT_REVERT_TO_REVISION,
	REQUEST_GRID_CONTAINER_EDITING_ADD,
	REQUEST_GRID_CONTAINER_EDITING_DELETE,
	REQUEST_GRID_CONTAINER_EDITING_MOVE,

	REQUEST_GRID_BOX_EDITING_CREATE,
	REQUEST_GRID_BOX_EDITING_REMOVE,
	REQUEST_GRID_BOX_EDITING_MOVE,
} from '../actions/types';


import {
	GRID_CONTAINER_ADD,
} from '../actions/state'


export default function updateGrid(state, action){
	switch (action.type) {
		case REQUEST_GRID_DOCUMENT_LOAD:
		case REQUEST_GRID_DOCUMENT_REVERT_DRAFT:
		case REQUEST_GRID_DOCUMENT_REVERT_TO_REVISION:
			return {
				...action.payload.grid,
			}
		case REQUEST_GRID_DOCUMENT_CHECK_DRAFT_STATE:
			return {
				...state,
				isDraft: action.payload.isDraft,
			}
		default:
			return {
				...state,
				container: updateContainer(state.container, action),
			};
	}
}

function updateContainer(state = [], action) {
	switch( action.type){
		case REQUEST_GRID_CONTAINER_EDITING_ADD:
		case GRID_CONTAINER_ADD:
			return addContainer(state, action)
		case REQUEST_GRID_CONTAINER_EDITING_DELETE:
			return deleteContainer(state, action)
		case REQUEST_GRID_CONTAINER_EDITING_MOVE:
			return moveContainer(state, action)
		default:
			return updateBoxes(state, action);
	}
}

function addContainer(state, action){
	return [
		...state.slice(0, action.payload.to_index ),
		action.payload.container,
		...state.slice(action.payload.to_index)
	]
}

function deleteContainer(state, action){
	return [
		...state.filter((c)=> c.id !== action.payload.container_id)
	]
}

function moveContainer(state, action){
	const { to_index, container_id} = action.payload;
	const target_container = state.filter((c)=> c.id === container_id )[0];
	const new_list = state.filter( (c)=> c.id !== container_id );
	new_list.splice(to_index, 0, target_container)
	return new_list;
}

function updateBoxes(state, action){
	let container = null;
	switch (action.type){
		case REQUEST_GRID_BOX_EDITING_CREATE:
			return createBox(state, action)
		case REQUEST_GRID_BOX_EDITING_REMOVE:
			return removeBox(state, action);
		case REQUEST_GRID_BOX_EDITING_MOVE:
			return moveBox(state, action)
		default:
			return state;
	}
}

function createBox(state, action){
	const {to_container_id, to_slot_id, to_box_index, box} = action.payload;
	const container = [
		...state,
	]
	findSlot(container, to_container_id, to_slot_id).boxes.splice(to_box_index,0,box)
	return container;
}

function removeBox(state, action){
	const {container_id, slot_id, index } = action.payload;
	const container = [
		...state,
	]
	findSlot(container, container_id, slot_id).boxes.splice(index,1)
	return container;
}

function moveBox(state, action){
	const {
		from_container_id, from_slot_id, from_box_index,
		to_container_id, to_slot_id, to_box_index,
	} = action.payload

	const container = [...state]

	let same_slot_correction = 0;
	if(from_container_id === to_container_id
		&& from_slot_id === to_slot_id ){

		/**
		 * no need for operation. it's the same position
		 */
		if( from_box_index === to_box_index || from_box_index+1 === to_box_index) return container;

		/**
		 * if dragged box before destination and in same slot we need to decrease the index because of coming slice operation
		 */
		if(from_box_index < to_box_index){
			same_slot_correction = -1;
		}
	}

	const box = findSlot(container, from_container_id, from_slot_id).boxes.splice(from_box_index,1)[0]
	const slot = findSlot(container, to_container_id, to_slot_id);

	slot.boxes = [
		...slot.boxes.slice(0,to_box_index+same_slot_correction),
		box,
		...slot.boxes.slice(to_box_index+same_slot_correction),
	]

	return container;
}




