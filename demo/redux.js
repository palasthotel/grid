'use strict';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import { createGridStore } from '../src/store/grid-store'



import {
	actionGridDocumentLoad,
	actionGridDocumentRevisions,
	actionGridStylesGet,
	actionGridPermissionRights,
} from '../src/actions/grid.document';


import { init as initBackend } from '../src/connection/backend';
initBackend({
	url: "/wp-admin/admin-ajax.php?action=grid_ajax",
});

// for debugging in console
window.GridStoreActions = require('../src/actions');

const grid_state = require('./dummy-data/grid');
const store = createGridStore(grid_state)

ReactDOM.render(
	<Provider store={store}>
		<h1>test</h1>
	</Provider>,
	document.getElementById('demo')
)

console.log("initial state", store.getState());

store.dispatch( actionGridDocumentLoad(1) )
store.dispatch( actionGridDocumentRevisions(1) )
store.dispatch( actionGridStylesGet() )
store.dispatch( actionGridPermissionRights() )

// store.dispatch( setGridLoading(true) )
// store.dispatch( addContainer( 0, {title:"test"}) )
// store.dispatch( addContainer( 0, {title:"test 2"}) )