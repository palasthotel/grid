'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import AppGrid from '../container/app-grid';

import {createGridStore} from '../store/grid-store';
import Provider from 'react-redux/src/components/Provider';

import {
	actionGridDocumentLoad,
	actionGridDocumentCheckDraftState,
	actionGridDocumentRevisions,
	actionGridStylesGet,
	actionGridPermissionRights,
} from '../actions/grid.document'

import {
	actionGridContainerEditingGetTypes,
} from '../actions/grid.container.editing';

import {
	actionGridBoxEditingMetaTypes,
} from '../actions/grid.box.editing';

import { init as initBackend } from '../connection/backend';

/**
 *
 * @param {object} settings
 * @param {node} root
 */
export function initGrid(settings, root){

	initBackend({
		url: settings.endpoint,
	});

	const store = createGridStore();

	function onPreview(grid_id, revision){
		if(typeof revision === typeof undefined || revision === null){
			window.open(
				settings.preview.url,
				"grid_preview"
			);
			return;
		}
		window.open(
			settings.preview.pattern.replace("{REV}", revision),
			"grid_preview"
		);
	}

	ReactDOM.render(
		<Provider store={store}>
			<AppGrid
				onPreview={onPreview}
			/>
		</Provider>,
		root
	)

	Promise.all(
		[
			store.dispatch( actionGridDocumentRevisions(1) ),
			store.dispatch( actionGridStylesGet() ),
			store.dispatch( actionGridPermissionRights() ),
			store.dispatch( actionGridContainerEditingGetTypes(1) ),
			store.dispatch( actionGridBoxEditingMetaTypes(1) )
		]
	).then(()=>{

		// if the dependencies are loaded load the grid
		store.dispatch( actionGridDocumentLoad(1) );
	})


	// watch state of draft
	let draft_state_timeout = null;
	let draft_check_needed = true;
	store.subscribe(function(){
		if( draft_check_needed ){
			console.log(" |||| check state ||| ")
			draft_check_needed = false;
			// check a little after the initial action
			setTimeout(()=>{
				store.dispatch(actionGridDocumentCheckDraftState(1))
			},10000)
		} else if(draft_state_timeout === null){
			draft_state_timeout = setTimeout(()=>{
				console.log(" |||| check state timeout ||| ")
				draft_check_needed=true;
				draft_state_timeout=null;
			},10000)
		}
	});

	let prev_draft_state = null;
	store.subscribe(()=>{
		if( prev_draft_state !== store.getState().grid.isDraft ){
			console.log(" --------- look for revisions")
			prev_draft_state = store.getState().grid.isDraft;
			store.dispatch(actionGridDocumentRevisions(1))
		}

	})


}