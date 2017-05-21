'use strict';

import {
	REQUEST_GRID_DOCUMENT_LOAD,
	REQUEST_GRID_DOCUMENT_CHECK_DRAFT_STATE,
	REQUEST_GRID_DOCUMENT_PUBLISH_DRAFT,
	REQUEST_GRID_DOCUMENT_REVERT_DRAFT,
	REQUEST_GRID_DOCUMENT_REVERT_TO_REVISION,
	REQUEST_GRID_DOCUMENT_REVISIONS,
	REQUEST_GRID_STYLES_GET,
	REQUEST_GRID_PERMISSION_RIGHTS,
} from './types'

import {
	setGridLoading,
} from './ui'

import {actionAsyncExecute} from './async'

import {
	requestGridDocumentLoad,
	requestGridDocumentPublishDraft,
	requestGridDocumentCheckDraftState,
	requestGridDocumentRevisions,
	requestGridStylesGetAll,
	requestGridPermissionRights,
	requestGridDocumentRevertDraft,
	requestGridDocumentRevertToRevision,
} from '../connection/backend'

export function actionGridDocumentLoad(grid_id) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridDocumentLoad.bind(this,grid_id),
		then: (dispatch, grid)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_DOCUMENT_LOAD, payload: { grid } } );
		}
	});
}

export function actionGridDocumentCheckDraftState(grid_id) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridDocumentCheckDraftState.bind(this,grid_id),
		then: (dispatch, isDraft)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_DOCUMENT_CHECK_DRAFT_STATE, payload: { isDraft } } );
		}
	});
}

export function actionGridDocumentPublishDraft(grid_id) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridDocumentPublishDraft.bind(this,grid_id),
		then: (dispatch, success)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_DOCUMENT_PUBLISH_DRAFT, payload: { success } } );
		}
	});
}


export function actionGridDocumentRevertDraft(grid_id) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridDocumentRevertDraft.bind(this,grid_id),
		then: (dispatch, grid)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_DOCUMENT_REVERT_DRAFT, payload: { grid } } );
		}
	});
}

export function actionGridDocumentRevertToRevision(args) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridDocumentRevertToRevision.bind(this,args),
		then: (dispatch, grid)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_DOCUMENT_REVERT_TO_REVISION, payload: { ...args, grid} } );
		}
	});
}

export function actionGridDocumentRevisions(grid_id) {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridDocumentRevisions.bind(this,grid_id),
		then: (dispatch, revisions)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_DOCUMENT_REVISIONS, payload: { revisions } } );
		}
	});
}


export function actionGridStylesGet() {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridStylesGetAll,
		then: (dispatch, styles)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_STYLES_GET, payload: { styles } } );
		}
	});
}

export function actionGridPermissionRights() {
	return actionAsyncExecute({
		before: (dispatch)=>{
			dispatch(setGridLoading(true));
		},
		request: requestGridPermissionRights,
		then: (dispatch, rights)=>{
			dispatch(setGridLoading(false));
			dispatch({ type: REQUEST_GRID_PERMISSION_RIGHTS, payload: { rights } } );
		}
	});
}

