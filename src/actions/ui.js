'use strict';


import {
	GRID_LOADING,
	GRID_BOX_EDIT,
} from './types';

export function setGridLoading(is_loading) {
	return {type: GRID_LOADING, payload: { is_loading }};
}


export function closeGridBoxEdit(){
	return editGridBox(undefined)
}
export function editGridBox(box){
	return { type: GRID_BOX_EDIT, payload: { box } }
}
