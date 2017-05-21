'use strict';

export const GRID_LOADING = 'GRID_LOADING';

export const GRID_UPDATE = "GRID-UPDATE"
export const GRID_IS_LOADING = "GRID-IS-LOADING"
export const GRID_CONTAINER_ADD = "GRID-CONTAINER-ADD"
export const GRID_CONTAINER_MOVE = "GRID-CONTAINER-MOVE"
export const GRID_CONTAINER_REMOVE = "GRID-CONTAINER-REMOVE"
export const GRID_BOX_ADD = "GRID-BOX-ADD"


// helper for default action object
function _create_action(type, payload, more = {}){
	return { type, payload, ...more };
}



export function actionGridUpdate(grid){
	return _create_action(GRID_UPDATE, {grid});
}

export function actionGridIsLoading(is_loading){
	return _create_action(GRID_IS_LOADING, {is_loading});
}

/**
 *
 * @param args
 * @param container
 * @return {type, payload}
 */
export function actionGridContainerAdd(args, container){
	return _create_action(GRID_CONTAINER_ADD, {...args, container} );
}
