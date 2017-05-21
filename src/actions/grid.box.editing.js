
import {
	REQUEST_GRID_BOX_EDITING_META_TYPES,
	REQUEST_GRID_BOX_EDITING_SEARCH,
	REQUEST_GRID_BOX_EDITING_CREATE,
	REQUEST_GRID_BOX_EDITING_MOVE,
	REQUEST_GRID_BOX_EDITING_REMOVE,
	REQUEST_GRID_BOX_EDITING_UPDATE,
} from './types'

import {
	setGridLoading,
} from './ui'

import {actionAsyncExecute} from './async'

import {
	requestGridEditingBoxMetaTypes,
	requestGridEditingBoxSearch,
	requestGridEditingBoxCreate,
	requestGridEditingBoxMove,
	requestGridEditingBoxRemove,
	requestGridEditingBoxUpdate,
} from '../connection/backend'

/**
 *
 * @param grid_id
 * @return {Promise}
 */
export function actionGridBoxEditingMetaTypes(grid_id) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridEditingBoxMetaTypes.bind(this,grid_id),
		then: (dispatch, result)=>{

			dispatch(setGridLoading(false));

			dispatch({
				type: REQUEST_GRID_BOX_EDITING_META_TYPES,
				payload: {box_types: result },
			});

		}
	});
}

/**
 *
 * @param {{grid_id, box_meta_type, query, criteria}} args
 * @return {Promise}
 */
export function actionGridBoxEditingBoxSearch(args) {
	return actionAsyncExecute({
		before: (dispatch)=>{

		},
		request: requestGridEditingBoxSearch.bind(this,args),
		then: (dispatch, boxes)=>{

			dispatch({
				type: REQUEST_GRID_BOX_EDITING_SEARCH,
				payload: { ...args, boxes },
			});

		}
	});
}

/**
 *
 * @param {{ grid_id, to_container_id, to_slot_id, to_box_index, box_type, box_content }} args
 * @return {Promise}
 */
export function actionGridBoxEditingCreate(args) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridEditingBoxCreate.bind(this,args),
		then: (dispatch, result)=>{

			dispatch(setGridLoading(false));

			dispatch({
				type: REQUEST_GRID_BOX_EDITING_CREATE,
				payload: { ...args, box: result },
			});

		}
	});
}
/**
 *
 * @param { {grid_id, from_container_id, from_slot_id, from_box_index, to_container_id, to_slot_id, to_box_index} } args
 * @return {Promise}
 */
export function actionGridBoxEditingMove(args) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridEditingBoxMove.bind(this, args),
		then: (dispatch, success)=>{

			dispatch(setGridLoading(false));

			dispatch({
				type: REQUEST_GRID_BOX_EDITING_MOVE,
				payload: { ...args, success },
			});

		}
	});
}

/**
 *
 * @param {{grid_id, container_id, slot_id, index}} args
 * @return {Promise}
 */
export function actionGridBoxEditingRemove(args) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridEditingBoxRemove.bind(this, args),
		then: (dispatch, success)=>{

			dispatch(setGridLoading(false));

			dispatch({
				type: REQUEST_GRID_BOX_EDITING_REMOVE,
				payload: { ...args, success },
			});

		}
	});
}

/**
 *
 * @param {{grid_id, container_id, slot_id, index, box}} args
 * @return {Promise}
 */
export function actionGridBoxEditingUpdate(args) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridEditingBoxUpdate.bind(this, args),
		then: (dispatch, box)=>{

			dispatch(setGridLoading(false));

			dispatch({
				type: REQUEST_GRID_BOX_EDITING_UPDATE,
				payload: { ...args, box  },
			});

		}
	});
}