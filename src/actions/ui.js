'use strict';


import {
	GRID_LOADING,
	GRID_CONTAINER_EDIT,
	GRID_BOX_EDIT,
} from './types';

export function actionSetGridLoading(is_loading) {
	return {type: GRID_LOADING, payload: { is_loading }};
}


export function actionCloseGridBoxEdit(){
	return actionEditGridBox(undefined)
}
export function actionEditGridBox(box){
	return { type: GRID_BOX_EDIT, payload: { box } }
}
export function actionEditGridContainer(container_id){
	return { type : GRID_CONTAINER_EDIT, payload: { container_id } }
}