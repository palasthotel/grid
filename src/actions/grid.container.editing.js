
import {
	REQUEST_GRID_CONTAINER_EDITING_GET_TYPES,
	REQUEST_GRID_CONTAINER_EDITING_ADD,
	REQUEST_GRID_CONTAINER_EDITING_DELETE,
	REQUEST_GRID_CONTAINER_EDITING_MOVE,
	REQUEST_GRID_CONTAINER_EDITING_UPDATE,
} from './types'

import {
	actionSetGridLoading,
	actionEditGridContainerClose,
} from './ui'

import { actionAsyncExecute } from './index'

import {
	requestGridEditingContainerGetTypes,
	requestGridEditingContainerAdd,
	requestGridEditingContainerDelete,
	requestGridEditingContainerMove,
	requestGridEditingContainerUpdate,
} from '../connection/backend'

/**
 *
 * @param grid_id
 * @return {Promise}
 */
export function actionGridContainerEditingGetTypes(grid_id) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(actionSetGridLoading(true));
		},
		request: requestGridEditingContainerGetTypes.bind(this,grid_id),
		then: (dispatch, result)=>{
			dispatch(actionSetGridLoading(false));
			dispatch({ type: REQUEST_GRID_CONTAINER_EDITING_GET_TYPES, payload: { container_types: result} } );
		}
	});
}

/**
 *
 * @param {{grid_id, container_type, to_index}} args
 * @return {Promise}
 */
export function actionGridContainerEditingAdd(args) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(actionSetGridLoading(true));
		},
		request: requestGridEditingContainerAdd.bind(this,args),
		then: (dispatch, result)=>{

			dispatch(actionSetGridLoading(false));

			dispatch({
				type: REQUEST_GRID_CONTAINER_EDITING_ADD,
				payload: {
					...args,
					container: {
						...result,
						type: args.container_type,
					}
				}
			});

		}
	});
}

/**
 *
 * @param {{grid_id, container_id, to_index}} args
 * @return {Promise}
 */
export function actionGridContainerEditingMove(args) {

	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(actionSetGridLoading(true));
		},
		request: requestGridEditingContainerMove.bind(this,args),
		then: (dispatch, result)=>{

			dispatch(actionSetGridLoading(false));

			dispatch({
				type: REQUEST_GRID_CONTAINER_EDITING_MOVE,
				payload: { ...args, result },
			});

		}
	});

}

/**
 *
 * @param {{grid_id, container_id}} args
 * @return {Promise}
 */
export function actionGridContainerEditingDelete(args) {

	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(actionSetGridLoading(true));
		},
		request: requestGridEditingContainerDelete.bind(this,args),
		then: (dispatch, result)=>{

			dispatch(actionSetGridLoading(false));

			dispatch({
				type: REQUEST_GRID_CONTAINER_EDITING_DELETE,
				payload: { ...args, result },
			});

		}
	});

}

/**
 *
 * @param {{grid_id, container_id, container}} args
 * @return {Promise}
 */
export function actionGridContainerEditingUpdate(args) {
	console.log(args);
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(actionSetGridLoading(true));
		},
		request: requestGridEditingContainerUpdate.bind(this, args),
		then: (dispatch, container)=>{

			dispatch(actionSetGridLoading(false));

			dispatch({
				type: REQUEST_GRID_CONTAINER_EDITING_UPDATE,
				payload: { ...args, container  },
			});

			dispatch(actionEditGridContainerClose())

		}
	});
}