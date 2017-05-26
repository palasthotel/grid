'use strict';


import {
	GRID_UI_STATE,
	GRID_LOADING,
	GRID_CONTAINER_EDIT,
	GRID_BOX_EDIT,
	GRID_CONTAINER_IN_PLACE_DIALOG,
} from './types';

/**
 * genereal ui state change
 * @param key
 * @param value
 * @return {{type: string, payload: {key: string, value: * }}}
 */
export function actionUiStateChange(key, value){
	return {type: GRID_UI_STATE, payload:{ key, value }};
}


export function actionSetGridLoading(is_loading) {
	return {type: GRID_LOADING, payload: { is_loading }};
}

export function actionContainerHideInPlaceDialog(){
	return actionContainerShowInPlaceDialog();
}

/**
 *
 * @param args
 * @return {{type, payload: { index:, others} }}
 */
export function actionContainerShowInPlaceDialog( args ){
	return {type:GRID_CONTAINER_IN_PLACE_DIALOG, payload: { ...args } }
}

export function actionEditGridContainerClose(){
	return actionEditGridContainer();
}
export function actionEditGridContainer(container_id){
	return { type : GRID_CONTAINER_EDIT, payload: { container_id } }
}

export function actionCloseGridBoxEdit(){
	return actionEditGridBox();
}
export function actionEditGridBox(box){
	return { type: GRID_BOX_EDIT, payload: { box } }
}
