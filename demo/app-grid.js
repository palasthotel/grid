'use strict';


import React from 'react';
import ReactDOM from 'react-dom';

import AppGrid from '../src/container/app-grid';

import {createGridStore} from '../src/store/grid-store';
import Provider from 'react-redux/src/components/Provider';

import {
	actionGridDocumentLoad,
	actionGridDocumentCheckDraftState,
	actionGridDocumentRevisions,
	actionGridStylesGet,
	actionGridPermissionRights,
} from '../src/actions/grid.document'

import {
	actionGridContainerEditingGetTypes,
} from '../src/actions/grid.container.editing';

import {
	actionGridBoxEditingMetaTypes,
} from '../src/actions/grid.box.editing';


import { init as initBackend } from '../src/connection/backend';




const store = createGridStore();


/**
 * append app to grid app root
 */
ReactDOM.render(
	<Provider store={store}>
	  <AppGrid/>
	</Provider>,

  document.getElementById("demo")
	
);


function gridInit(settings){

	// TODO: find a way to proper set settings from outside
	// TODO: find a way to hook into grid (plugins, widgets and so on)


	initBackend({
		url: "/wp-admin/admin-ajax.php?action=grid_ajax",
	});


	store.dispatch( actionGridDocumentLoad(1) ).then(()=>{

		return Promise.all([
			store.dispatch( actionGridDocumentRevisions(1) ),
			store.dispatch( actionGridStylesGet() ),
			store.dispatch( actionGridPermissionRights() ),
		]);

	}).then(()=>{

		store.dispatch( actionGridContainerEditingGetTypes(1) )
		store.dispatch( actionGridBoxEditingMetaTypes(1) )

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
			},300)
		} else if(draft_state_timeout === null){
			draft_state_timeout = setTimeout(()=>{
				console.log(" |||| check state timeout ||| ")
				draft_check_needed=true;
				draft_state_timeout=null;
			},1000)
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

gridInit({
	ajaxurl:  "/wp-admin/admin-ajax.php?action=grid_ajax",
	preview:{
		url: "previewurl",
		patter: "patternforrevisions",
	},
});



