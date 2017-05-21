import React from 'react';
import ReactDOM from 'react-dom';
import TheGrid from '../src/container/the-grid';

import {createGridStore} from '../src/store/grid-store';
import Provider from 'react-redux/src/components/Provider';

/**
 * grid dummy
 * @type {{id: number, isDraft: boolean, container: *[], isSidebar: boolean}}
 */
var grid = require('./dummy-data/grid');
var revisions = require('./dummy-data/revisions');
var container_types = require('./dummy-data/container_types');
var box_types = require('./dummy-data/box_types');

import { init as initBackend } from '../src/connection/backend';
initBackend({
	url: "/wp-admin/admin-ajax.php?action=grid_ajax",
});

const store = createGridStore();






/**
 * append app to grid app root
 */
ReactDOM.render(
	<Provider store={store}>
	  <TheGrid/>
	</Provider>,

  document.getElementById("demo")
	
);



store.dispatch( actionGridDocumentLoad(1) )
store.dispatch( actionGridDocumentRevisions(1) )
store.dispatch( actionGridStylesGet() )
store.dispatch( actionGridPermissionRights() )